<?php 
  if(isset($_POST['submit'])){
    $to = "andrewsjuchem@gmail.com"; // this is your email address
    $from = $_POST['email']; // this is the sender's Email address
    $name = $_POST['name'];
    $subject = "Petricor - Mensagem do Site";
    $subject2 = "Petricor - Mensagem enviada com sucesso";
    $message = $name . " escreveu a seguinte mensagem:" . "\n\n" . $_POST['message'];
    $message2 = "Olá " . $name . ". A seguinte mensagem foi enviada para Petricor. \n\n" . $_POST['message'];

    $headers = "From:" . $from;
    $headers2 = "From:" . $to;

    if (mail($to, $subject, $message, $headers)) {
        //echo "Enviado!";
        echo "<script type='text/javascript'>"; 
        echo "    alert('Email enviado com sucesso.');"; 
        echo "    location.href = 'index.html'; "; 
        echo " </script>"; 
      } else {
        //echo "Ocorreu um erro durante o envio da mensagem.";
        echo "<script type='text/javascript'>"; 
        echo "    alert('Ocorreu um erro durante o envio do e-mail.');"; 
        echo "    location.href = 'index.html'; "; 
        echo " </script>"; 
      }
    // mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender
    // You can also use header('Location: thank_you.php'); to redirect to another page.
    // You cannot use header and echo together. It's one or the other.
  }
?>