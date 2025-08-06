import express from 'express';

export default class A2AServer {
  constructor(agentCard, agentInstance) {
    this.card = agentCard;
    this.agent = agentInstance;
    this.router = express.Router();

    this.router.post('/a2a/task', this.handleTask.bind(this));
  }

  async handleTask(req, res) {
    const { from, task } = req.body;

    // Burada yetkilendirme ve güvenlik kontrolleri yapılabilir.

    const result = await this.agent.handleRequest(task);
    res.json({ agent: this.card, result });
  }
}
