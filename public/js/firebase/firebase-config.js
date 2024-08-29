
// Solicitar permissão para notificações
function pedirPermissaoNotificacao() {
  if (Notification.permission === 'default') {
      Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
                console.log('Permissão concedida');
          }
      });
  }
}

pedirPermissaoNotificacao();
