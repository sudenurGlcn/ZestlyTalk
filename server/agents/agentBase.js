export default class AgentBase {
  constructor(name) {
    this.name = name;
  }

  async handleRequest(params) {
    throw new Error('handleRequest metodu implement edilmelidir.');
  }
}
