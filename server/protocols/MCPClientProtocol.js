import { Client } from "@modelcontextprotocol/sdk/client/index.js";

/**
 * MCPClient is a wrapper around the Model Context Protocol SDK Client.
 * It provides a clean interface for invoking tools and fetching resources.
 */
export default class MCPClient {
  /**
   * Initializes a new MCP client.
   * @param {string} serverUrl - The base URL of the MCP server.
   * @param {string} authToken - Authorization token for secure access.
   */
  constructor(serverUrl, authToken) {
    this.client = new Client({
      url: serverUrl,
      token: authToken,
    });
  }

  /**
   * Calls a remote tool with specified arguments via MCP.
   * @param {string} toolName - Name of the tool to invoke.
   * @param {object} toolArgs - Arguments to pass to the tool.
   * @returns {Promise<any>} Result of the tool invocation.
   */
  async callTool(toolName, toolArgs) {
    try {
      return await this.client.invokeTool(toolName, toolArgs);
    } catch (error) {
      console.error(`Error invoking tool "${toolName}":`, error);
      throw error;
    }
  }

  /**
   * Fetches contextual resource data from the MCP server.
   * @param {string} resourceName - The name of the resource to fetch.
   * @param {object} params - Parameters to filter or modify the request.
   * @returns {Promise<any>} Resource data.
   */
  async fetchContext(resourceName, params) {
    try {
      return await this.client.fetchResource(resourceName, params);
    } catch (error) {
      console.error(`Error fetching resource "${resourceName}":`, error);
      throw error;
    }
  }
}
