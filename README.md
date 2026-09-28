# Mini Blog Application

A simple yet elegant blog application built with Flask (backend) and HTML/CSS/JavaScript (frontend).

## Features

✨ **Create Posts** - Write and publish new blog posts with title, content, and author name
📝 **Edit Posts** - Update existing posts with ease
🗑️ **Delete Posts** - Remove posts you no longer want
📱 **Responsive Design** - Works great on desktop and mobile devices
💾 **Persistent Storage** - Posts are saved to a JSON file
🎨 **Beautiful UI** - Modern gradient design with smooth animations
🔒 **Security** - Input validation, XSS protection, and safe data handling

## Project Structure

```
mini-blog/
├── app.py              # Flask backend application
├── requirements.txt    # Python dependencies
├── .gitignore          # Git ignore rules
├── .env.example        # Example environment variables
├── templates/
│   └── index.html      # HTML template
├── static/
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
├── posts.json          # Database file (auto-created, not committed)
└── README.md           # This file
```

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Setup Instructions

1. **Clone or download the project** and navigate to the project directory:
```bash
cd mini-blog
```

2. **Create a virtual environment** (optional but recommended):
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment variables** (optional):
```bash
# Copy the example file
cp .env.example .env

# Edit .env as needed
```

5. **Run the application**:
```bash
python app.py
```

6. **Open in browser**:
   - Navigate to `http://localhost:5000`
   - Start creating and sharing blog posts!

## Security Features

✅ **Input Validation**
- Title: max 200 characters
- Content: max 5000 characters
- Author: max 100 characters

✅ **XSS Protection**
- HTML content properly escaped on frontend
- Prevents malicious script injection

✅ **CORS Protection**
- Limited to localhost by default
- Prevents unauthorized cross-origin requests

✅ **Debug Mode Disabled**
- Production-safe by default
- Can be enabled via `FLASK_DEBUG` environment variable

✅ **No Sensitive Data in Repository**
- `posts.json` is in `.gitignore`
- `.env` files are ignored
- Only template `.env.example` is committed

## Usage

### Creating a Post
1. Fill in your name (optional - defaults to "Anonymous")
2. Enter a post title
3. Write your blog content
4. Click "Publish Post"

### Editing a Post
1. Find the post you want to edit
2. Click the "Edit" button
3. Update the content
4. Click "Save Changes"

### Deleting a Post
1. Find the post you want to delete
2. Click the "Delete" button
3. Confirm the deletion

## API Endpoints

### Get all posts
```
GET /api/posts
```

### Create a new post
```
POST /api/posts
Content-Type: application/json

{
  "title": "Post Title (max 200 chars)",
  "content": "Post content here (max 5000 chars)",
  "author": "Your Name (optional, max 100 chars)"
}
```

### Get a specific post
```
GET /api/posts/<post_id>
```

### Update a post
```
PUT /api/posts/<post_id>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "author": "Author Name"
}
```

### Delete a post
```
DELETE /api/posts/<post_id>
```

## Technologies Used

- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: JSON file-based database
- **Design**: Responsive CSS with Flexbox and Grid
- **Security**: CORS, Input Validation, XSS Protection

## Future Enhancements

Here are some ideas to extend the application:

- User authentication and login system
- Database integration (SQLite, PostgreSQL, etc.)
- Comments on posts
- Search and filter functionality
- Markdown support for posts
- Categories/tags for posts
- Dark mode toggle
- Social sharing features
- Rate limiting for API endpoints

## Production Deployment

Before deploying to production, ensure:

1. Set `FLASK_DEBUG=False` (default)
2. Use a production WSGI server (Gunicorn, uWSGI, etc.)
3. Configure CORS properly for your domain
4. Set up HTTPS/SSL
5. Consider adding authentication
6. Use a proper database (not JSON files)
7. Implement rate limiting
8. Add logging and monitoring

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, feel free to ask!

---

Happy blogging! 📝
