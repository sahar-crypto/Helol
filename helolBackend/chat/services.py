import httpx

async def get_answer(query):
    url = "http://helol-agent:3030/search"
    params = {"query": query, "top_k": 1}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            print("Getting answer...")
            print(response)
            data = response.json()[0]

        similarity = data["similarity"]
        if similarity > 70:
            return data["solution"]
        return "سيتم تحويل مشكلتك إلى الجهة المختصة"

    except Exception as e:
        print(f"Exception: {e}")
        return "عذراً. لا استطيع الاجابه الآن. برجاء المحاوله مره أخرى في وقت لاحق"

async def get_text_from_speech(file_path):
    url = "http://helol-agent:3030/speech-to-text"
    payload = {"record_path": file_path}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            print("Getting text from speech...")
            print(response)
            text = response.json()
            return text

    except Exception as e:
        raise Exception(f"Error while getting text from speech: {e}")
