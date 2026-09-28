// DOM Elements
const postForm = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeBtn = document.querySelector('.close');

let currentEditId = null;

// Event Listeners
postForm.addEventListener('submit', handleCreatePost);
editForm.addEventListener('submit', handleUpdatePost);
closeBtn.addEventListener('click', closeModal);

// Load posts on page load
document.addEventListener('DOMContentLoaded', loadPosts);

/**
 * Load all posts from the backend
 */
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to load posts');
        
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
        postsList.innerHTML = '<p class="loading">Error loading posts</p>';
    }
}

/**
 * Render posts to the DOM
 */
function renderPosts(posts) {
    if (posts.length === 0) {
        postsList.innerHTML = '<div class="empty-state"><p>No posts yet. Be the first to share!</p></div>';
        return;
    }

    postsList.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
            </div>
            <p class="post-meta">
                By <strong>${escapeHtml(post.author)}</strong> • ${new Date(post.created_at).toLocaleDateString()} ${new Date(post.created_at).toLocaleTimeString()}
            </p>
            <p class="post-content">${escapeHtml(post.content)}</p>
            <div class="post-actions">
                <button class="btn btn-edit" onclick="openEditModal(${post.id}, '${escapeAttr(post.title)}', '${escapeAttr(post.content)}', '${escapeAttr(post.author)}')">
                    Edit
                </button>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Handle form submission for creating a new post
 */
async function handleCreatePost(e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const author = document.getElementById('author').value.trim();

    if (!title || !content) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                author: author || 'Anonymous'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create post');
        }

        // Reset form
        postForm.reset();
        document.getElementById('author').value = 'Anonymous';

        // Reload posts
        loadPosts();
        alert('Post published successfully!');
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Open the edit modal
 */
function openEditModal(postId, title, content, author) {
    currentEditId = postId;
    document.getElementById('editTitle').value = title;
    document.getElementById('editContent').value = content;
    document.getElementById('editAuthor').value = author;
    editModal.classList.add('show');
}

/**
 * Close the edit modal
 */
function closeModal() {
    editModal.classList.remove('show');
    currentEditId = null;
}

/**
 * Handle form submission for updating a post
 */
async function handleUpdatePost(e) {
    e.preventDefault();

    if (!currentEditId) return;

    const title = document.getElementById('editTitle').value.trim();
    const content = document.getElementById('editContent').value.trim();
    const author = document.getElementById('editAuthor').value.trim();

    if (!title || !content) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const response = await fetch(`/api/posts/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                author: author || 'Anonymous'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update post');
        }

        closeModal();
        loadPosts();
        alert('Post updated successfully!');
    } catch (error) {
        console.error('Error updating post:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Delete a post
 */
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        loadPosts();
        alert('Post deleted successfully!');
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Escape attributes for safe use in HTML attributes
 */
function escapeAttr(text) {
    return text.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeModal();
    }
});
