from flask_bcrypt import Bcrypt
from tinydb import TinyDB, Query
import uuid 
from datetime import datetime
import json 

db_7 = TinyDB("profiles.json")

def addProfile(userId):
    id = uuid.uuid4()
    db_7.insert({"id": str(id.hex), "userId": str(userId).replace("-", ""), "summary": None})
    return str(id.hex)

def updateProfile(userId, summary):
    Profile = Query()
    db_7.update({"summary": summary}, Profile.userId == userId)
    return db_7.search(Profile.userId == userId)[0]

def getProfile(userId):
    Profile = Query()
    res = db_7.search(Profile.userId == userId)[0]
    return res 

def allProfile():
    return db_7.all()

db_2 = TinyDB("users.json")

def allUsers(userId):
    Conv = Query()
    convs = db_5.search((Conv.user1 == userId) or (Conv.user2== userId ))
    users = []
    for conv in convs:
        users.extend([convs["user1"], conv["user2"]])
    User = Query()
    res = db_2.search(User.id not in users)
    return res

def addUser(email, username, password, wallet, apikey):
    id = uuid.uuid4()
    User = Query()
    res = db_2.search(User.username == username)
    if res != []:
        return False
    db_2.insert({"id": str(id.hex), "email": email, "username": username, "password": password, "wallet": wallet, "apiKey": apikey})
    addProfile(id)
    return True


def getUsername(userId):
    print(userId)
    User = Query()
    user = db_2.search(User.id == userId)[0]
    return user["username"]


def findUser(username, password, bcrypt):
    User = Query()
    user = db_2.search(User.username == username)
    if bcrypt.check_password_hash(user[0]["password"], password):
        return user 
    else:
        return None
     
def getUserById(id):
    User = Query()
    user = db_2.search(User.id == id)[0]
    return user

db_3 = TinyDB("posts.json")

def AddPostNFT(id, nft_id):
    Post = Query()
    db_3.update({"nft_id": nft_id}, Post.id == id )

def addPost(content, user):
    id = uuid.uuid4() 
    db_3.insert({"id": str(id.hex), "content": content,"date": json.dumps(datetime.now(), indent=3, sort_keys=True, default=str), "user": user, "likes": []})
    return str(id.hex)

def updatePost(id, new_user):
    Post= Query()
    db_3.update({"user": new_user},Post.id == id)

def getPostData(id, user):
    Post = Query()
    User = Query()
    post = db_3.search(Post.id == id)[0]
    nft_id = post["nft_id"] 
    user = db_2.search(User.id == user)[0]
    apiKey = user["apiKey"]
    wallet = user["wallet"]
    return nft_id, apiKey, wallet


def findPostByUser(user):
    Post = Query()
    post = db_3.search(Post.user == user)
    return post 

def findPostById(id):
    Post = Query()
    post = db_3.search(Post.id == id)[0]
    return post

def likePost(id, userId):
    Post = Query()
    post = db_3.search(Post.id == id)[0]
    if  post["likes"] == None:
        likes = [userId]
    else:
        likes = post["likes"]
        if userId in likes:
            return db_3.search(Post.id == id)[0]
        likes.append(userId)
    db_3.update({"likes": likes},Post.id == id)
    return db_3.search(Post.id == id)[0]

def findAll():
    posts = db_3.all()
    return posts

def removePost(id, user):
    Post = Query()
    db_3.remove(Post.id == id)
    return db_3.search(Post.user == user)

db_4 = TinyDB("comments.json")

def addComment(content, userId, postId):
    id = uuid.uuid4() 
    Comment = Query()
    db_4.insert({"id": str(id.hex), "content": content, "user": userId, "date":json.dumps(datetime.now(), indent=3, sort_keys=True, default=str), "post": postId, "likes": [] })
    return db_4.search(Comment.post == postId)

def LikeComment(id, userId):
    Comment = Query()
    comment = db_4.search(Comment.id == id)[0]
    print(comment)
    if comment["likes"]== None:
        likes = [userId]
    else:
        likes = comment["likes"]
        if userId in likes:
            return db_4.search(Comment.id == id)[0]
        likes.append(userId)
    db_4.update({"likes": likes},Comment.id == id)
    return db_4.search(Comment.id == id)[0]

def getCommentsByPost(post):
    Comment = Query()
    comments = db_4.search(Comment.post == post)
    return comments

def AllPostWithComment():
    post = db_3.all()
    tmp = []
    for p in post:
        c = p
        Comment = Query()
        comments = db_4.search(Comment.post ==  p["id"])[:2]
        c["comments"] = comments
        tmp.append(c)
    print(tmp)
    return tmp
       
db_5 = TinyDB("conversations.json")

def addConv(user1, user2):
    id = uuid.uuid4()
    db_5.insert({"id": str(id.hex), "user1": user1, "user2": user2, 'date':json.dumps(datetime.now(), indent=3, sort_keys=True, default=str)})
    return str(id.hex) 

def checkConv(user1, user2):
    Conv = Query()
    convs = db_5.search(((Conv.user1 == user1) & (Conv.user2 == user2)) | ((Conv.user1 == user2) & (Conv.user2 == user1)))
    if len(convs) != 0:

        return convs[0]['id']
    else:
        id = addConv(user1, user2)
        return id

def getConv(userId):
    Conv = Query()
    convs = db_5.search(((Conv.user2 == userId ) | (Conv.user1 == userId) ))

    return convs

db_6 = TinyDB("messages.json")

def addMessage(convId, content, userId):
    id = uuid.uuid4()
    db_6.insert({"id": str(id.hex), "convId": convId, "content": content, "date":json.dumps(datetime.now(), indent=3, sort_keys=True, default=str) ,"userId": userId})
    return str(id.hex) 

def getMessages(convId):
    Messages = Query()
    print(convId)
    msg = db_6.search(Messages.convId == convId)
    return msg

