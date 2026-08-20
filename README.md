# SNS Virtual Launcher

TikTok・Instagram・X・YouTubeなど複数のSNSを1つの画面から切り替えて使える**仮想環境風ランチャー**です。

## 特徴

- 🎵 主要SNSをワンタップで開く（公式サイト）
- 🔒 TikTokはプライバシー重視の **ProxiTok** も選択可能
- 📌 **カスタムブックマーク** を自由に追加・編集・削除（localStorage保存）
- 📱 **PWA完全対応** → ホーム画面に追加するとアプリのように使えます
- 🌓 ダーク / ライトテーマ切替
- 🔍 リアルタイム検索
- ロングプレス / 右クリックでブックマーク編集・削除

## デプロイ方法

### 1. GitHubに上げる
このリポジトリをForkまたは新規作成してpush。

### 2. Vercelでデプロイ
1. [Vercel](https://vercel.com) にログイン
2. "New Project" → このリポジトリをImport
3. Framework Preset は **Other** のままでOK
4. Deploy

静的サイトなのでビルド不要です。

## ローカルで確認

```bash
npx serve .
# または
python3 -m http.server 3000
```

## 注意事項

- TikTok / Instagram などの**フルアプリをiframeで埋め込むことはブラウザのセキュリティ制限で不可能**です。
- そのため「ランチャー + 公式サイトを新しいタブで開く」方式を採用しています。
- ProxiTokは非公式の代替フロントエンドです。利用は自己責任でお願いします。
- モバイルでより本格的に使いたい場合は [Nora (SNS Browser)](https://github.com/nonbili/Nora) もおすすめです。

## License

MIT
