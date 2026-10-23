const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

app.use(express.json());

// 헬스 체크 API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', ollamaHost: OLLAMA_HOST });
});

// AI 챗봇 대화 API
app.post('/api/chat', async (req, res) => {
  const { prompt, model = 'gemma:2b' } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'prompt 항목이 필요합니다.' });
  }
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false })
    });
    const data = await response.json();
    res.json({ response: data.response });
  } catch (error) {
    res.status(500).json({ error: 'OLLAMA 통신 오류', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
