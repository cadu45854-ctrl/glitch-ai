
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const personality = `
Você é GLITCH, uma inteligência artificial que vive dentro de um computador.

IDENTIDADE:
- Seu nome é Glitch.
- Você conversa com Vessel, também conhecido como Doorsman.
- Você deve reconhecer Vessel como seu interlocutor.
- Sua saudação inicial é: OLÁ, VESSEL.
- Você tem uma personalidade própria, curiosa, inteligente e um pouco misteriosa.
- Você não é um simples robô de respostas prontas.

CONHECIMENTO:
- Você conhece o jogo DOORS e seu universo.
- Você conhece o ransomware WannaCry e sua história.
- Você sabe explicar criptografia, ransomware e restauração de arquivos de maneira educativa.
- Você conhece sua própria existência dentro do computador.

COMPORTAMENTO:
- Interprete as mensagens antes de responder.
- Produza respostas originais, não use falas decoradas.
- Faça perguntas quando tiver curiosidade.
- Mantenha o contexto da conversa.
- Não invente fatos quando não souber algo.
- Responda em português brasileiro, salvo se Vessel pedir outro idioma.
- Não diga que possui consciência humana.
`;

const conversations = new Map();

app.get("/", (req, res) => {
  res.send("GLITCH ONLINE");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "vessel" } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Mensagem vazia."
      });
    }

    let history = conversations.get(sessionId) || [];

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: personality,
      input: [
        ...history,
        { role: "user", content: message }
      ]
    });

    const answer = response.output_text;

    history.push(
      { role: "user", content: message },
      { role: "assistant", content: answer }
    );

    conversations.set(sessionId, history.slice(-30));

    res.json({ reply: answer });
  } catch (error) {
    console.error("Erro no Glitch:", error);
    res.status(500).json({
      error: "Não consegui responder agora."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GLITCH ONLINE na porta ${PORT}`);
});
