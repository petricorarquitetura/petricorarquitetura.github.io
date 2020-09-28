<?php
  require 'vendor/autoload.php'; // If you're using Composer (recommended)
  // Comment out the above line if not using Composer
  // require("<PATH TO>/sendgrid-php.php");
  // If not using Composer, uncomment the above line and
  // download sendgrid-php.zip from the latest release here,
  // replacing <PATH TO> with the path to the sendgrid-php.php file,
  // which is included in the download:
  // https://github.com/sendgrid/sendgrid-php/releases

  $to = "petricorarquitetura@gmail.com"; // this is your email address
  $from = $_POST['email']; // this is the sender's Email address
  $name = $_POST['name'];
  $message = $name . " escreveu a seguinte mensagem:" . "\n\n" . $_POST['message'];

  $email = new \SendGrid\Mail\Mail(); 
  $email->setFrom($from, "Petricor");
  $email->setSubject("Petricor - Mensagem do Site");
  $email->addTo($to, $name);
  // $email->addContent("text/plain", "and easy to do anywhere, even with PHP");
  $email->addContent(
      "text/html", $message
  );
  $sendgrid = new \SendGrid('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');
  try {
      $response = $sendgrid->send($email);
      // print $response->statusCode() . "\n";
      // print_r($response->headers());
      // print $response->body() . "\n";
      echo "<script type='text/javascript'>"; 
      echo "    alert('Email enviado com sucesso.');"; 
      echo "    location.href = 'index.html'; "; 
      echo " </script>"; 
  } catch (Exception $e) {
      // echo 'Caught exception: '. $e->getMessage() ."\n";
      echo "<script type='text/javascript'>"; 
      echo "    alert('Ocorreu um erro durante o envio do e-mail.');"; 
      echo "    location.href = 'index.html'; "; 
      echo " </script>"; 
  }

?>