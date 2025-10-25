from datetime import timedelta
from flask import Flask, send_file
from flask import jsonify
from flask import request 
from db import AddPostNFT, getPostData, removePost, addProfile,allProfile,checkConv, addUser, allUsers, findUser,getUserById, findPostById, getConv, addPost, AllPostWithComment, addComment, addConv, findPostByUser, getProfile, getUsername ,findAll, likePost, LikeComment, getCommentsByPost, getMessages, updatePost, updateProfile
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from huggingface_hub import InferenceClient
from io import BytesIO
from PIL import Image
from nft import createWallet, createNFT, transferOwnership

client = InferenceClient(
    provider="fal-ai",
    api_key="bd3e32d2-39e0-4abf-858f-d3a7970757c3:8b973a70bbf8860206f4754ac41e2cc8",
)

app = Flask(__name__)

CORS(app)

bcrypt = Bcrypt(app)

app.config["JWT_SECRET_KEY"] = "louai"
app.config["JWT_TOKEN_LOCATION"]= ["headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1000)
MEGABYTE = (2 ** 10) ** 2
app.config['MAX_CONTENT_LENGTH'] = None
app.config['MAX_FORM_MEMORY_SIZE'] = 1000 * MEGABYTE

jwt = JWTManager(app)

@app.route("/api/login", methods=["POST", "OPTIONS"])
@cross_origin(origins="*")
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = findUser(username=username, password=password, bcrypt=bcrypt)
    if not user:
        return jsonify({"message": "User does not exist"}), 401
    
    access_token = create_access_token(identity=user[0]["id"])
    return jsonify({"token": access_token, "userId": user[0]["id"]}), 200

@app.route("/api/signup", methods =["POST", "OPTIONS"])
@cross_origin(origins="*")
def signup():
    username = request.json.get("username",None)
    password = request.json.get("password", None)
    email = request.json.get("email", None)
    apiKey = request.json.get("apiKey", None)
    pw_hash = bcrypt.generate_password_hash(password)
    wallet = createWallet(apiKey, email)
    print(wallet)
    res = addUser(email=email, password=pw_hash.decode("utf-8"), username=username, wallet= wallet["address"], apikey=apiKey)
    
    if res == True:
        return jsonify({"msg": "User created"}), 200
    else:
        return jsonify({"msg": "User exists"}), 500

@app.route("/api/users/all", methods=["GET", "OPTIONS"])
@cross_origin(origins="*")
@jwt_required()
def getUsers():
    user = get_jwt_identity()
    users = allUsers(user)
    return jsonify({"users": users})

@app.route("/api/post/image", methods = ["POST", "OPTIONS"], endpoint = "CreatePostImage")
@cross_origin(origins="*")
@jwt_required()
def CreatePostImage():
    user = get_jwt_identity()
    content= request.form.get('content')
    price = request.form.get("price")
    input_image = request.files['file']
    
    image = client.image_to_image(
    input_image,
    prompt="Convert this image into engrave drawing style.",
    model="gokaygokay/Pencil-Drawing-Kontext-Dev-LoRA",
)
    image= image.resize((512,512),Image.LANCZOS).convert('L')
    buffer = BytesIO()
    image.save(buffer, 'JPEG', quality=80)
    id = addPost(content=content, user=user)
    with open ("./uploads/"+str(id)+".jpeg", 'wb') as h:
        h.write(buffer.getbuffer())
    imageURL = "https://backend.thesketch.app/uploads/"+str(id)+".jpeg"
    user = getUserById(user)
    nft = createNFT(user["apiKey"], user["wallet"], imageURL, price, "usdc")
    AddPostNFT(id, nft["id"])
    return send_file("./uploads/"+str(id)+".jpeg", as_attachment=True)

@app.route("/api/post/buyNFT", methods=["POST", "OPTIONS"], endpoint="BuySimNFT")
@cross_origin(origins="*")
@jwt_required()
def SimBuyNFT():
    user = get_jwt_identity()
    id = request.json.get("id", None)
    nft_id, apikey, wallet = getPostData(id, user)
    print(nft_id)
    print(wallet)
    _ = transferOwnership(apikey, nft_id, wallet)
    updatePost(id,user)
    return jsonify({"msg": "transaction done ..."}), 200
    
@app.route("/api/profile/image", methods=["POST", "OPTIONS"], endpoint= "UpdateProfileImage")
@cross_origin(origins="*")
@jwt_required()
def UpdateProfileImage():
    id = get_jwt_identity()
    input_image = request.files['file']
    image = client.image_to_image(
    input_image,
    prompt="Convert this image into pencil_drawing art style.",
    model="fal/Pencil-Drawing-Kontext-Dev-LoRA",
    )
    buffer = BytesIO()
    image= image.resize((512,512),Image.LANCZOS).convert('L')
    with open ("./uploads/"+str(id)+".jpeg", 'wb') as h:
        h.write(buffer.getbuffer())
    return send_file("./uploads/"+str(id)+".jpeg", as_attachment=True)


@app.route("/uploads/<id>", methods=["GET", "OPTIONS"], endpoint="GetIm")
@cross_origin(origins="*")
def GetIm(id):
    return send_file("./uploads/"+ str(id))


@app.route("/api/post", methods = ["POST", "OPTIONS"], endpoint = "CreatePost")
@cross_origin(origins="*")
@jwt_required()
def CreatePost():
    user = get_jwt_identity()
    content= request.json.get("content",None)
    prompt = request.json.get("prompt", None)
    price = request.json.get("price", None)

    image = client.text_to_image(
    "storyboard sketch of "+ prompt,
    model="blink7630/storyboard-sketch")
    image= image.resize((512,512),Image.LANCZOS)
    buffer = BytesIO()
    image.save(buffer, 'JPEG', quality=80)
    
    id = addPost(content=content, user=user)
    with open ("./uploads/"+id+".jpeg", 'wb') as h:
        h.write(buffer.getbuffer())
    imageURL = "https://backend.thesketch.app/uploads/"+str(id)+".jpeg"
    user = getUserById(user)
    nft = createNFT(user["apiKey"], user["wallet"], imageURL, price, "usdc")
    AddPostNFT(id, nft["id"])
    return send_file("./uploads/"+str(id)+".jpeg", as_attachment=True)

@app.route("/api/profile", methods=["POST", "OPTIONS"], endpoint= "UpdateProfile")
@cross_origin(origins="*")
def UpdateProfile():
    id = request.json.get("id", None)
    prompt = request.json.get("prompt", None)
    image = client.text_to_image(
    "storyboard sketch of "+ prompt,
    model="blink7630/storyboard-sketch")
    image= image.resize((512,512),Image.LANCZOS)
    buffer = BytesIO()
    image.save(buffer, 'JPEG', quality=50)
    with open ("./uploads/"+str(id)+".jpeg", 'wb') as h:
        h.write(buffer.getbuffer())
    return send_file("./uploads/"+str(id)+".jpeg", as_attachment=True)

@app.route("/api/profile/summary", methods=["POST", "OPTIONS"], endpoint= "UpdateSummary")
@cross_origin(origins="*")
def UpdateSummary():
    user = request.json.get("id", None)
    print(user)
    summary = request.json.get("summary", None)
    print(summary)
    res = updateProfile(user, summary)
    return jsonify({'profile': res}), 200

@app.route("/api/profile/get", methods = ["GET", "OPTIONS"], endpoint = "GetProfile")
@cross_origin(origins="*")
@jwt_required()
def GetProfile():
    user = get_jwt_identity()
    res = getProfile(user)
    return jsonify({"profile": res}), 200

@app.route("/api/profile/custom", methods = ["POST", "OPTIONS"], endpoint = "GetCProfile")
@cross_origin(origins="*")
@jwt_required()
def GetCProfile():
    user = request.json.get('id', None)
    res = getProfile(user)
    return jsonify({"profile": res}), 200

@app.route('/api/profile/all', methods =['GET', 'OPTIONS'], endpoint='GetAProfile')
@cross_origin(origins='*')
@jwt_required()
def GetAProfile():
    result = allProfile()
    return jsonify({'profiles': result}), 200

@app.route("/api/user", methods=["POST", "OPTIONS"], endpoint = "GetUser")
@cross_origin(origins="*")
def GetUser():
    user_id = request.json.get("id", None)
    username = getUsername(userId= user_id)
    return jsonify({"username": username}), 200

@app.route("/api/image", methods = ["POST", "OPTIONS"], endpoint = "GetImage")
@cross_origin(origins="*")
def GetImage():
    id = request.json.get("id", None)
    return send_file("./uploads/"+str(id)+".jpeg", as_attachment=True)

@app.route("/api/post/one", methods = ["POST", "OPTIONS"], endpoint= "GetOnePost")
@cross_origin(origins="*")
@jwt_required()
def GetOnePost():
    id = request.json.get("id", None)
    post = findPostById(id)
    return jsonify({"post": post}), 200

@app.route("/api/post/delete", methods = ["POST", "OPTIONS"], endpoint= "DeleteOnePost")
@cross_origin(origins="*")
@jwt_required()
def DeleteOnePost():
    user = get_jwt_identity()
    id = request.json.get("id", None)
    post = removePost(id, user)
    return jsonify({"posts": post}), 200


@app.route("/api/post/get", methods = ["GET", "OPTIONS"], endpoint = "GetPosts")
@cross_origin(origins="*")
@jwt_required()
def GetPosts():
    user = request.json.get("id", None)
    print(user)
    posts = findPostByUser(user=user)
    return jsonify({'posts': posts}), 200

@app.route("/api/post/custom", methods = ["POST", "OPTIONS"], endpoint = "GetCPosts")
@cross_origin(origins="*")
@jwt_required()
def GetCPosts():
    user = request.json.get("id", None)
    posts = findPostByUser(user=user)
    return jsonify({'posts': posts}), 200

@app.route("/api/post/getall", methods = ["GET", "OPTIONS"], endpoint = "AllPosts")
@cross_origin(origins="*")
@jwt_required()
def AllPosts():
    posts = AllPostWithComment()
    return jsonify({"posts": posts}), 200

@app.route("/api/post/like", methods = ["POST", "OPTIONS"], endpoint= "LikePosts")
@cross_origin(origins="*")
@jwt_required()
def LikePosts():
    user = get_jwt_identity()
    post_id = request.json.get('id', None)
    posts = likePost(post_id,user)
    return jsonify({'posts': posts}), 200

@app.route("/api/comment", methods = ["POST", "OPTIONS"], endpoint = "AddComment")
@cross_origin(origins="*")
@jwt_required()
def AddComment():
    content= request.json.get("content",None)
    print(content)
    user_id = get_jwt_identity()
    post_id = request.json.get("id", None)
    comments = addComment(content=content, userId=user_id, postId=post_id)
    return jsonify({"comments": comments}), 200

@app.route("/api/comment/like", methods= ["POST", "OPTIONS"], endpoint = "likeComment")
@cross_origin(origins="*")
@jwt_required()
def likeComment():
    id = request.json.get("id", None)
    user_id = get_jwt_identity()
    comments = LikeComment(id, user_id)
    return jsonify({"comments": comments}), 200

@app.route("/api/comment/get", methods=["POST", "OPTIONS"], endpoint = "GetComments")
@cross_origin(origins="*")
@jwt_required()
def GetComments():
    id = request.json.get("id", None)
    comments = getCommentsByPost(id)    
    return jsonify({"comments": comments}), 200


@app.route("/api/conv", methods = ["POST", "OPTIONS"], endpoint= "addConversation")
@cross_origin(origins="*")
@jwt_required()
def addCoversation():
    user1 = get_jwt_identity()
    user2 = request.json.get("user", None)
    id = addConv(user1, user2)
    return jsonify({"convId": str(id)}), 200

@app.route("/api/conv/check", methods = ["POST", "OPTIONS"], endpoint= "checkConversation")
@cross_origin(origins="*")
@jwt_required()
def checkCoversation():
    user1 = get_jwt_identity()
    user2 = request.json.get("user", None)
    id = checkConv(user1, user2)
    return jsonify({"convId": str(id)}), 200

@app.route("/api/conv/get", methods= ["GET", "OPTIONS"], endpoint="getConversation")
@cross_origin(origins="*")
@jwt_required()
def getConversation():
    user = get_jwt_identity()
    conv = getConv(user)
    print(conv)
    return jsonify({"conv": conv}), 200

@app.route("/api/chat/get", methods= ["POST", "OPTION"], endpoint="getMsg")
@cross_origin(origins="*")
@jwt_required()
def getMsg():
    convId = request.json.get("id", None)
    print(id)
    msg = getMessages(convId)
    return jsonify({"msg": msg}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
