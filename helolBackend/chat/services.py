import requests


def get_answer(query):

    url = "http://helol-agent:3030/search/"
    params = {
        "query": query,
        "top_k": 1
    }

    try:
        response = requests.get(url, params=params)
        print("Getting answer...")
        data = response.json()[0]
        similarity = data["similarity"]
        if similarity > 70:
            answer = data["solution"]
        else:
            answer = "سيتم تحويل مشكلتك إلى الجهة المختصة"
        return answer
    except Exception as e:
        print(f"Exception: {e}")
        return None
