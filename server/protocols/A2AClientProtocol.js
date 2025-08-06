import fetch from 'node-fetch';

export default class A2AClient {
  constructor(agentCard) {
    this.card = agentCard;
  }

  async sendTask(targetAgentUrl, taskPayload) {
    const resp = await fetch(`${targetAgentUrl}/a2a/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: this.card, task: taskPayload }),
    });
    return resp.json();
  }
}
