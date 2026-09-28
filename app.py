from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)

# Security Configuration
app.config['JSON_SORT_KEYS'] = False
CORS(app, resources={r"/api/*": {"origins": ["localhost", "127.0.0.1"]}})

# File to store blog posts
POSTS_FILE = 'posts.json'

def validate_input(title, content):
    """Validate and sanitize user input"""
    if not title or not content:
        return False
    
    # Check length limits to prevent abuse
    if len(title) > 200 or len(content) > 5000:
        return False
    
    return True

def load_posts():
    """Load posts from JSON file"""
    if os.path.exists(POSTS_FILE):
        with open(POSTS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_posts(posts):
    """Save posts to JSON file"""
    with open(POSTS_FILE, 'w') as f:
        json.dump(posts, f, indent=2)

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/posts', methods=['GET'])
def get_posts():
    """Get all blog posts"""
    posts = load_posts()
    return jsonify(posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    """Create a new blog post"""
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Title and content are required'}), 400
    
    # Validate input
    if not validate_input(data['title'], data['content']):
        return jsonify({'error': 'Invalid input. Title max 200 chars, content max 5000 chars'}), 400
    
    posts = load_posts()
    
    new_post = {
        'id': len(posts) + 1,
        'title': data['title'].strip(),
        'content': data['content'].strip(),
        'author': data.get('author', 'Anonymous').strip()[:100],  # Limit author name
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    posts.append(new_post)
    save_posts(posts)
    
    return jsonify(new_post), 201

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """Get a specific blog post"""
    posts = load_posts()
    post = next((p for p in posts if p['id'] == post_id), None)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    return jsonify(post)

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    """Update a blog post"""
    data = request.get_json()
    posts = load_posts()
    
    post = next((p for p in posts if p['id'] == post_id), None)
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    post['title'] = data.get('title', post['title'])
    post['content'] = data.get('content', post['content'])
    post['author'] = data.get('author', post['author'])
    
    save_posts(posts)
    return jsonify(post)

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    """Delete a blog post"""
    posts = load_posts()
    posts = [p for p in posts if p['id'] != post_id]
    save_posts(posts)
    
    return jsonify({'message': 'Post deleted successfully'})

if __name__ == '__main__':
    # Use environment variable for debug mode (default to False for security)
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, port=5000)
