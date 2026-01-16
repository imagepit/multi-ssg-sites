import { ChatOpenAI } from '@langchain/openai'
import 'dotenv/config'

// 1. モデルのインスタンスを作成
const model = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
})

// 2. モデルを呼び出し
async function main() {
  const response = await model.invoke('こんにちは！')
  console.log(response)
}

main()
