import requests

def createWallet(apiKey, email):
    url = "https://staging.crossmint.com/api/2025-06-09/wallets"
    payload = {
    "chainType": "evm",
    "type": "smart",
    "config": {
        "adminSigner": {
            "type": "email",
            "email": email
        }
    },
    "owner": "email:"+email
    }
    headers = {
    "X-API-KEY": apiKey,
    "Content-Type": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def createNFT(apiKey, walletAddress, imageURL, price, currency):
    url = "https://staging.crossmint.com/api/2022-06-09/collections/"
    headers = {
    "X-API-KEY": apiKey,
    "Content-Type": "application/json"
    }
    payload= {
    "chain": "polygon",
    "metadata": {
    "name": "Test NFT",
    "imageUrl": imageURL,
    "description": "This is a sample NFT collection",
    "symbol": "TOKEN"
    },
    "fungibility": "non-fungible",
    "transferable": True,
    "supplyLimit": 123,
    "payments": {
    "price": price,
    "recipientAddress": walletAddress, 
    "currency": currency
    },
    "subscription": {
    "enabled": False
    },
    "reuploadLinkedFiles": True
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def transferOwnership(apiKey, collectionId, recipentWalletAddress, price=0, currency="usdc"):
    url = "https://staging.crossmint.com/api/2022-06-09/collections/"+ collectionId
    headers = {
    "X-API-KEY": apiKey,
    "Content-Type": "application/json"
    }
    payload= {
    "supplyLimit": 123,
    "payments": {
    "price": price,
    "recipientAddress": recipentWalletAddress,
    "currency": currency
    }
    }
    response = requests.post(url, json=payload, headers=headers)
    print(response)
    return response.json()

