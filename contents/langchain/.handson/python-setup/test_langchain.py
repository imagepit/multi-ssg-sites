from langchain.schema import HumanMessage, SystemMessage
from langchain.schema.messages import BaseMessage

# LangChainの基本的なメッセージクラスをテスト
def test_langchain_basic():
    # システムメッセージを作成
    system_msg = SystemMessage(content="あなたは親切なアシスタントです。")
    
    # 人間からのメッセージを作成
    human_msg = HumanMessage(content="こんにちは！")
    
    # メッセージの内容を表示
    print("システムメッセージ:", system_msg.content)
    print("人間のメッセージ:", human_msg.content)
    print("LangChainの基本機能が正常に動作しています！")

if __name__ == "__main__":
    test_langchain_basic()