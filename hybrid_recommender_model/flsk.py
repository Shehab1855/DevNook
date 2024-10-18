from flask import Flask, request, jsonify
from Post import hybrid_recommender_model  as hybrid_recommender_model_post
from PROJECT import hybrid_recommender_model  as hybrid_recommender_model_PROJECT
from QUESTION import hybrid_recommender_model  as hybrid_recommender_model_QUESTION

# Initialize Flask app
app = Flask(__name__)

@app.route('/recommend/post', methods=['GET'])
def recommend_items_for_user_for_post():
    user_id = request.args.get('user_id')
   
    if user_id is None:
        return jsonify({'error': 'User ID is missing in the request parameters'}), 400
    
    try:
        recommendations = hybrid_recommender_model_post.recommend_items(user_id, topn=15, verbose=False)
        recommended_post_ids = recommendations['PostId'].tolist()
        
        # Convert each post ID to an integer
        recommended_post_ids = [int(post_id) for post_id in recommended_post_ids]
        
        return jsonify(recommended_post_ids)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while recommending items. Please try again later.'}), 500
    



@app.route('/recommend/PROJECT', methods=['GET'])
def recommend_items_for_user_for_project():
    user_id = request.args.get('user_id')
   
    if user_id is None:
        return jsonify({'error': 'User ID is missing in the request parameters'}), 400
    
    try:
        recommendations = hybrid_recommender_model_PROJECT.recommend_items(user_id, topn=15, verbose=False)
        recommended_post_ids = recommendations['projectId'].tolist()
        
        # Convert each post ID to an integer
        recommended_post_ids = [int(post_id) for post_id in recommended_post_ids]
        
        return jsonify(recommended_post_ids)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while recommending items. Please try again later.'}), 500
 



@app.route('/recommend/QUESTION', methods=['GET'])
def recommend_items_for_user_for_question():
    user_id = request.args.get('user_id')
   
    if user_id is None:
        return jsonify({'error': 'User ID is missing in the request parameters'}), 400
    
    try:
        recommendations = hybrid_recommender_model_QUESTION.recommend_items(user_id, topn=15, verbose=False)
        recommended_post_ids = recommendations['QuestionId'].tolist()
        
        # Convert each post ID to an integer
        recommended_post_ids = [int(post_id) for post_id in recommended_post_ids]
        
        return jsonify(recommended_post_ids)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while recommending items. Please try again later.'}), 500
 




# Define a simple health check route
@app.route('/health', methods=['GET'])
def health_check():
    user_id = request.args.get('user_id')
    return user_id, 200

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
