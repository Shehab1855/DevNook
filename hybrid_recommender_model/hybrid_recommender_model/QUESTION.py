
import numpy as np
import scipy
import pandas as pd
import math
import random
import sklearn
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse.linalg import svds
import matplotlib.pyplot as plt


# In[2]:


import pyodbc



cnxn_str = ("Driver={ODBC Driver 17 for SQL Server};"

            "Server=AMIN-MOSTAFA\SQLEXPRESS;"

            "Database=amin;"

            "Trusted_Connection=yes;")


cnxn = pyodbc.connect(cnxn_str)

cursor = cnxn.cursor()

#cursor.execute("SELECT * FROM questions;")

articles_df = pd.read_sql("SELECT * FROM questions;", cnxn)


# In[3]:


interactions_df = pd.read_sql("SELECT * FROM questionEvents;", cnxn)


# In[4]:


event_type_strength = {
   'dislike': -1.0,
   'like': 2.0, 
   'Bookmark': 2.5, 
   'comment': 4.0,  
}
interactions_df['eventStrength'] = interactions_df['typeEvent'].apply(lambda x: event_type_strength[x])


# In[5]:


users_interactions_count_df = interactions_df.groupby(['userid', 'QuestionId']).size().groupby('userid').size()

users_with_enough_interactions_df = users_interactions_count_df[users_interactions_count_df >= 1].reset_index()[['userid']]


# In[6]:





# In[7]:


interactions_from_selected_users_df = interactions_df.merge(users_with_enough_interactions_df, 
               how = 'right',
               left_on = 'userid',
               right_on = 'userid')


# In[8]:





# In[9]:


import math

def smooth_user_preference(x):
    if x < 0:
        return 0  # or any other suitable value
    return math.log(1+x, 2)
    
interactions_full_df = interactions_from_selected_users_df \
                    .groupby(['userid', 'QuestionId'])['eventStrength'].sum() \
                    .apply(smooth_user_preference).reset_index()



# In[10]:


interactions_train_df, interactions_test_df = train_test_split(interactions_full_df,
                                              test_size=0.20,  # Original test size
                                              random_state=42)





# In[11]:


#Indexing by userid to speed up the searches during evaluation
interactions_full_indexed_df = interactions_full_df.set_index('userid')
interactions_train_indexed_df = interactions_train_df.set_index('userid')
interactions_test_indexed_df = interactions_test_df.set_index('userid')


# In[12]:





# In[13]:


def get_items_interacted(userid, interactions_df):
    # Get the user's data and merge in the movie information.
    interacted_items = interactions_df.loc[userid]['QuestionId']
    return set(interacted_items if type(interacted_items) == pd.Series else [interacted_items])


# In[14]:


#Top-N accuracy metrics consts
EVAL_RANDOM_SAMPLE_NON_INTERACTED_ITEMS = 1

class ModelEvaluator:


    #def get_not_interacted_items_sample(self, userid, sample_size, seed=42):
    #    interacted_items = get_items_interacted(userid, interactions_full_indexed_df)
    #    all_items = list(articles_df['Id'])  # Convert to list
    #    non_interacted_items = list(set(all_items) - set(interacted_items))  # Convert to list
    #   random.seed(seed)
    #    non_interacted_items_sample = random.sample(non_interacted_items, sample_size)
    #    return set(non_interacted_items_sample)
    
    def get_not_interacted_items_sample(self, userid, sample_size, seed=42):
        interacted_items = get_items_interacted(userid, interactions_full_indexed_df)
        all_items = list(articles_df['Id'])  # Convert to list
        non_interacted_items = list(set(all_items) - set(interacted_items))  # Convert to list

        if sample_size > len(non_interacted_items):
            sample_size = len(non_interacted_items)

        random.seed(seed)
        non_interacted_items_sample = random.sample(non_interacted_items, sample_size)
        return set(non_interacted_items_sample)


    def _verify_hit_top_n(self, item_id, recommended_items, topn):        
        try:
            index = next(i for i, c in enumerate(recommended_items) if c == item_id)
        except:
            index = -1
        hit = int(index in range(0, topn))
        return hit, index

    def evaluate_model_for_user(self, model, userid):
        #Getting the items in test set
        interacted_values_testset = interactions_test_indexed_df.loc[userid]
        if type(interacted_values_testset['QuestionId']) == pd.Series:
            person_interacted_items_testset = set(interacted_values_testset['QuestionId'])
        else:
            person_interacted_items_testset = set([int(interacted_values_testset['QuestionId'])])  
        interacted_items_count_testset = len(person_interacted_items_testset) 

        #Getting a ranked recommendation list from a model for a given user
        person_recs_df = model.recommend_items(userid, 
                                               items_to_ignore=get_items_interacted(userid, 
                                                                                    interactions_train_indexed_df), 
                                               topn=10000000000)

        hits_at_5_count = 0
        hits_at_10_count = 0
        #For each item the user has interacted in test set
        for item_id in person_interacted_items_testset:
            #Getting a random sample (100) items the user has not interacted 
            #(to represent items that are assumed to be no relevant to the user)
            non_interacted_items_sample = self.get_not_interacted_items_sample(userid, 
                                                                          sample_size=EVAL_RANDOM_SAMPLE_NON_INTERACTED_ITEMS, 
                                                                          seed=item_id%(2**32))

            #Combining the current interacted item with the 100 random items
            items_to_filter_recs = non_interacted_items_sample.union(set([item_id]))

            #Filtering only recommendations that are either the interacted item or from a random sample of 100 non-interacted items
            valid_recs_df = person_recs_df[person_recs_df['QuestionId'].isin(items_to_filter_recs)]                    
            valid_recs = valid_recs_df['QuestionId'].values
            #Verifying if the current interacted item is among the Top-N recommended items
            hit_at_5, index_at_5 = self._verify_hit_top_n(item_id, valid_recs, 5)
            hits_at_5_count += hit_at_5
            hit_at_10, index_at_10 = self._verify_hit_top_n(item_id, valid_recs, 10)
            hits_at_10_count += hit_at_10

        #Recall is the rate of the interacted items that are ranked among the Top-N recommended items, 
        #when mixed with a set of non-relevant items
        recall_at_5 = hits_at_5_count / float(interacted_items_count_testset)
        recall_at_10 = hits_at_10_count / float(interacted_items_count_testset)

        person_metrics = {'hits@5_count':hits_at_5_count, 
                          'hits@10_count':hits_at_10_count, 
                          'interacted_count': interacted_items_count_testset,
                          'recall@5': recall_at_5,
                          'recall@10': recall_at_10}
        return person_metrics

    def evaluate_model(self, model):
        #print('Running evaluation for users')
        people_metrics = []
        for idx, userid in enumerate(list(interactions_test_indexed_df.index.unique().values)):
            #if idx % 100 == 0 and idx > 0:
            #    print('%d users processed' % idx)
            person_metrics = self.evaluate_model_for_user(model, userid)  
            person_metrics['_userid'] = userid
            people_metrics.append(person_metrics)

        detailed_results_df = pd.DataFrame(people_metrics) \
                            .sort_values('interacted_count', ascending=False)
        
        global_recall_at_5 = detailed_results_df['hits@5_count'].sum() / float(detailed_results_df['interacted_count'].sum())
        global_recall_at_10 = detailed_results_df['hits@10_count'].sum() / float(detailed_results_df['interacted_count'].sum())
        
        global_metrics = {'modelName': model.get_model_name(),
                          'recall@5': global_recall_at_5,
                          'recall@10': global_recall_at_10}    
        return global_metrics, detailed_results_df
    
model_evaluator = ModelEvaluator()     


# In[15]:


#Computes the most popular items
item_popularity_df = interactions_full_df.groupby('QuestionId')['eventStrength'].sum().sort_values(ascending=False).reset_index()


# In[16]:


class PopularityRecommender:
    
    MODEL_NAME = 'Popularity'
    
    def __init__(self, popularity_df, items_df=None):
        self.popularity_df = popularity_df
        self.items_df = items_df
        
    def get_model_name(self):
        return self.MODEL_NAME
        
    def recommend_items(self, user_id, items_to_ignore=[], topn=10, verbose=False):
        # Recommend the more popular items that the user hasn't seen yet.
        recommendations_df = self.popularity_df[~self.popularity_df['QuestionId'].isin(items_to_ignore)] \
                               .sort_values('eventStrength', ascending = False) \
                               .head(topn)

        if verbose:
            if self.items_df is None:
                raise Exception('"items_df" is required in verbose mode')

            recommendations_df = recommendations_df.merge(self.items_df, how = 'left', 
                                                          left_on = 'QuestionId', 
                                                          right_on = 'QuestionId')[['text']]


        return recommendations_df
    
popularity_model = PopularityRecommender(item_popularity_df, articles_df)


# In[17]:


pop_global_metrics, pop_detailed_results_df = model_evaluator.evaluate_model(popularity_model)


# In[18]:





# In[19]:


#Ignoring stopwords (words with no semantics) from English and Portuguese (as we have a corpus with mixed languages)
stopwords_list = stopwords.words('english') 

#Trains a model whose vectors size is 5000, composed by the main unigrams and bigrams found in the corpus, ignoring stopwords
vectorizer = TfidfVectorizer(analyzer='word',
                     ngram_range=(1, 2),
                     min_df=0.003,
                     max_df=0.5,
                     max_features=5000,
                     stop_words=stopwords_list)

item_ids = articles_df['Id'].tolist()
tfidf_matrix = vectorizer.fit_transform( articles_df['question'])
tfidf_feature_names = vectorizer.get_feature_names_out()
tfidf_matrix


# In[20]:





# In[21]:


def get_item_profile(item_id):
    idx = item_ids.index(item_id)
    item_profile = tfidf_matrix[idx:idx+1]
    return item_profile

def get_item_profiles(ids):
    if isinstance(ids, float):  # Check if it's a single float
        ids = [int(ids)]
    else:  # Otherwise, assume it's an iterable (e.g., a Series)
        ids = [int(x) for x in ids]

    item_profiles_list = [get_item_profile(x) for x in ids]
    item_profiles = scipy.sparse.vstack(item_profiles_list)
    return item_profiles

def build_users_profile(person_id, interactions_indexed_df):
    interactions_person_df = interactions_indexed_df.loc[person_id]
    user_item_profiles = get_item_profiles(interactions_person_df['QuestionId'])
    
    user_item_strengths = np.array(interactions_person_df['eventStrength']).reshape(-1,1)
    # Weighted average of item profiles by the interactions strength
    user_item_strengths_weighted_avg = np.sum(user_item_profiles.multiply(user_item_strengths), axis=0) / np.sum(user_item_strengths)
    
    # Replace NaN values with 0
    user_item_strengths_weighted_avg = np.nan_to_num(user_item_strengths_weighted_avg)
    
    # Convert to numpy array
    user_item_strengths_weighted_avg = np.asarray(user_item_strengths_weighted_avg)
    
    user_profile_norm = sklearn.preprocessing.normalize(user_item_strengths_weighted_avg)
    return user_profile_norm

def build_users_profiles(): 
    interactions_indexed_df = interactions_full_df[interactions_full_df['QuestionId'] \
                                                   .isin(articles_df['Id'])].set_index('userid')
    user_profiles = {}
    for person_id in interactions_indexed_df.index.unique():
        user_profiles[person_id] = build_users_profile(person_id, interactions_indexed_df)
    return user_profiles

# Now you can call build_users_profiles to get user profiles
user_profiles = build_users_profiles()




# Now you can call build_users_profiles to get user profiles
user_profiles = build_users_profiles()




# In[17]:


user_profiles = build_users_profiles()
class ContentBasedRecommender:
    
    MODEL_NAME = 'Content-Based'
    
    def __init__(self, items_df=None):
        self.item_ids = item_ids
        self.items_df = items_df
        
    def get_model_name(self):
        return self.MODEL_NAME
        
    def _get_similar_items_to_user_profile(self, person_id, topn=1000):
        #Computes the cosine similarity between the user profile and all item profiles
        cosine_similarities = cosine_similarity(user_profiles[person_id], tfidf_matrix)
        #Gets the top similar items
        similar_indices = cosine_similarities.argsort().flatten()[-topn:]
        #Sort the similar items by similarity
        similar_items = sorted([(item_ids[i], cosine_similarities[0,i]) for i in similar_indices], key=lambda x: -x[1])
        return similar_items
        
    def recommend_items(self, user_id, items_to_ignore=[], topn=10, verbose=False):
        similar_items = self._get_similar_items_to_user_profile(user_id)
        #Ignores items the user has already interacted
        similar_items_filtered = list(filter(lambda x: x[0] not in items_to_ignore, similar_items))
        
        recommendations_df = pd.DataFrame(similar_items_filtered, columns=['QuestionId', 'recStrength']) \
                                    .head(topn)

        if verbose:
            if self.items_df is None:
                raise Exception('"items_df" is required in verbose mode')

            recommendations_df = recommendations_df.merge(self.items_df, how = 'left', 
                                                          left_on = 'QuestionId', 
                                                          right_on = 'QuestionId')[['recStrength', 'QuestionId']]


        return recommendations_df
    
content_based_recommender_model = ContentBasedRecommender(articles_df)


# In[27]:


cb_global_metrics, cb_detailed_results_df = model_evaluator.evaluate_model(content_based_recommender_model)



# In[28]:


#Creating a sparse pivot table with users in rows and items in columns
users_items_pivot_matrix_df = interactions_train_df.pivot(index='userid', 
                                                          columns='QuestionId', 
                                                          values='eventStrength').fillna(0)



# In[29]:


users_items_pivot_matrix = users_items_pivot_matrix_df.values


# In[30]:


users_ids = list(users_items_pivot_matrix_df.index)


# In[36]:


#The number of factors to factor the user-item matrix.
NUMBER_OF_FACTORS_MF = 2
#Performs matrix factorization of the original user item matrix
U, sigma, Vt = svds(users_items_pivot_matrix, k = NUMBER_OF_FACTORS_MF)


# In[42]:


U.shape
Vt.shape
sigma = np.diag(sigma)
sigma.shape


# In[43]:


all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) 



# In[44]:


#Converting the reconstructed matrix back to a Pandas dataframe
cf_preds_df = pd.DataFrame(all_user_predicted_ratings, columns = users_items_pivot_matrix_df.columns, index=users_ids).transpose()


# In[45]:





# In[47]:


class CFRecommender:
    
    MODEL_NAME = 'Collaborative Filtering'
    
    def __init__(self, cf_predictions_df, items_df=None):
        self.cf_predictions_df = cf_predictions_df
        self.items_df = items_df
        
    def get_model_name(self):
        return self.MODEL_NAME
        
    def recommend_items(self, user_id, items_to_ignore=[], topn=10, verbose=False):
        # Get and sort the user's predictions
        sorted_user_predictions = self.cf_predictions_df[user_id].sort_values(ascending=False) \
                                    .reset_index().rename(columns={user_id: 'recStrength'})

        # Recommend the highest predicted rating movies that the user hasn't seen yet.
        recommendations_df = sorted_user_predictions[~sorted_user_predictions['QuestionId'].isin(items_to_ignore)] \
                               .sort_values('recStrength', ascending = False) \
                               .head(topn)

        if verbose:
            if self.items_df is None:
                raise Exception('"items_df" is required in verbose mode')

            recommendations_df = recommendations_df.merge(self.items_df, how = 'left', 
                                                          left_on = 'QuestionId', 
                                                          right_on = 'QuestionId')[['recStrength', 'QuestionId']]


        return recommendations_df
    
cf_recommender_model = CFRecommender(cf_preds_df, articles_df)


# In[48]:


cf_global_metrics, cf_detailed_results_df = model_evaluator.evaluate_model(cf_recommender_model)


# In[49]:


class HybridRecommender:
    
    MODEL_NAME = 'Hybrid'
    
    def __init__(self, cb_rec_model, cf_rec_model, items_df):
        self.cb_rec_model = cb_rec_model
        self.cf_rec_model = cf_rec_model
        self.items_df = items_df
        
    def get_model_name(self):
        return self.MODEL_NAME
        
    def recommend_items(self, user_id, items_to_ignore=[], topn=10, verbose=False):
        #Getting the top-1000 Content-based filtering recommendations
        cb_recs_df = self.cb_rec_model.recommend_items(user_id, items_to_ignore=items_to_ignore, verbose=verbose,
                                                           topn=1000).rename(columns={'recStrength': 'recStrengthCB'})
        
        #Getting the top-1000 Collaborative filtering recommendations
        cf_recs_df = self.cf_rec_model.recommend_items(user_id, items_to_ignore=items_to_ignore, verbose=verbose, 
                                                           topn=1000).rename(columns={'recStrength': 'recStrengthCF'})
        
        #Combining the results by contentId
        recs_df = cb_recs_df.merge(cf_recs_df,
                                   how = 'inner', 
                                   left_on = 'QuestionId', 
                                   right_on = 'QuestionId')
        
        #Computing a hybrid recommendation score based on CF and CB scores
        recs_df['recStrengthHybrid'] = recs_df['recStrengthCB'] * recs_df['recStrengthCF']
        
        #Sorting recommendations by hybrid score
        recommendations_df = recs_df.sort_values('recStrengthHybrid', ascending=False).head(topn)

        if verbose:
            if self.items_df is None:
                raise Exception('"items_df" is required in verbose mode')

            recommendations_df = recommendations_df.merge(self.items_df, how = 'left', 
                                                          left_on = 'QuestionId', 
                                                          right_on = 'contentId')[['recStrengthHybrid', 'contentId']]


        return recommendations_df
    
hybrid_recommender_model = HybridRecommender(content_based_recommender_model, cf_recommender_model, articles_df)


# In[50]:


hybrid_global_metrics, hybrid_detailed_results_df = model_evaluator.evaluate_model(hybrid_recommender_model)


# In[51]:


global_metrics_df = pd.DataFrame([pop_global_metrics, cf_global_metrics, cb_global_metrics, hybrid_global_metrics]) \
                        .set_index('modelName')


# In[52]:





# In[54]:


def inspect_interactions(person_id, test_set=True):
    if test_set:
        interactions_df = interactions_test_indexed_df
    else:
        interactions_df = interactions_train_indexed_df
    return interactions_df.loc[person_id].merge(articles_df, how = 'left', 
                                                      left_on = 'QuestionId', 
                                                      right_on = 'contentId') \
                          .sort_values('eventStrength', ascending = False)[['eventStrength', 
                                                                          'contentId']]


# In[56]:


def recommend_items_for_user_for_question(topn=15, verbose=False):
    # Get user input for user ID
    user_id = input("Enter user ID: ").strip()

    # Assuming hybrid_recommender_model is your recommender model
    recommendations = hybrid_recommender_model.recommend_items(user_id, topn=topn, verbose=verbose)
    
    # Extract 'PostId' column and return as a list
    post_ids = recommendations['QuestionId'].tolist()
    
    return post_ids





