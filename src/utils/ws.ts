/*
 * @Description: WebSocket工具函数
 */
import { ref } from 'vue';

export function useWebSocket(url: string) {
  const socket = ref<any>(null);
  const isConnected = ref(false);
  const message = ref(null);
  const error = ref(null);
  const { protocol, host, port } = window.location;
  const baseUrl = '';
  const wsUrl = `${protocol === 'https:' ? 'wss' : 'ws'}://${host}${baseUrl}${url}`;
  const connect = () => {
    socket.value = new WebSocket(wsUrl);
    socket.value.onopen = () => {
      isConnected.value = true;
      console.log('WebSocket is connected');
    };

    socket.value.onmessage = event => {
      message.value = event.data;
      console.log('Received message:', event.data);
    };

    socket.value.onclose = () => {
      isConnected.value = false;
      console.log('WebSocket is closed');
    };

    socket.value.onerror = err => {
      error.value = err;
      console.error('WebSocket error:', err);
    };
  };

  const send = (data: any) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(data);
      console.log('Sent message:', data);
    } else {
      console.error('WebSocket is not connected');
      if (!isConnected.value) {
        setTimeout(() => {
          connect();
        }, 1000);
      }
    }
  };

  const close = () => {
    if (socket.value) {
      socket.value.close();
    }
  };

  return {
    socket,
    connect,
    isConnected,
    message,
    error,
    send,
    close,
  };
}
