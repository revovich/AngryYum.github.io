<?php
$phone = $_POST['phone'];
if(empty($phone)) {
?>
<html>
<head>
<meta http-equiv="content-type" content="text/html;charset=UTF-8" /><title>Спасибо!</title></head>
<body style="color: rgb(0, 0, 0); max-width: 980px; min-width: 300px; width: auto; margin: 0px auto; background-color: rgb(255, 255, 255); font-family: pt sans,arial;">
<br><br>
<center style="padding: 15px 30px; border: 3px solid rgb(63, 63, 63); background-color: rgb(255, 161, 161);">
<h1 style="font-size: 1.4rem;">Вы не ввели необходимые данные!<br>
Вернитесь на сайт и заполните контакнутю форму.<br>
</h1></center><br><br>
<a style="display: inline-block;height: 53px;height: 5.3rem;margin: 0px 0 0px;padding: 0 24px; font-size: 1.8rem; letter-spacing: 0.02em; line-height: 53px; line-height: 5.3rem; text-align: center; text-decoration: none; color: black; transition: background-color 0.2s ease-out 0s; border-radius: 7px; text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5); -webkit-box-shadow: inset 0px -3px 0px 0px rgba(50, 50, 50, 0.2); -moz-box-shadow: inset 0px -3px 0px 0px rgba(50, 50, 50, 0.2); box-shadow: inset 0px -3px 0px 0px rgba(50, 50, 50, 0.2); background: rgb(196, 255, 161); width:500px;margin:0 auto;display:block; border: 1px solid #ccc;" href="./" class='hover'>
Вернуться на сайт</a>
</body>
</html>
<?
}else {
	
$email2="Babelyan92@mail.ru"; 
$headers  =  'MIME-Version: 1.0' . "\r\n";
	$headers .=  'Content-type: text/html; charset=UTF-8' . "\r\n";
	$headers .=  'To: <'.$email2.'>, '."\r\n";
	$headers .=  'From: <FITNESS>' . "\r\n"; 
$subject2    = "Новая заявка FITNESS"; 
$message2    = "
<br>Имя: ".$_POST['name']."
<br>Телефон: ".$_POST['phone']."
<br>IP-адрес посетителя: ".@$_SERVER['REMOTE_ADDR']."
";
$mail=mail($email2, $subject2, $message2, $headers);
if($mail==true){
?>
<html>
<head>
    <title>Спасибо за заказ!</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500,300italic,700&subset=latin,cyrillic'
          rel='stylesheet' type='text/css'>
    <link media="all" href="thank/mainup.css" rel="stylesheet" type="text/css"/>
   

</head><br><br><br>
<body class="man">
<div class="section block-1">
    <div class="wrap">
        <img src="thank/call-girl.png" alt="">

        <div class="top-title">
            <h2>Спасибо, Ваш заказ принят!</h2>

            <div>Наш оператор свяжется с вами в течение 30 минут</div>
            <p>Юлия Анисимова, старший менеджер отдела продаж</p>
        </div>
    </div>
</div>

<br><br>
<a style="display: inline-block;height: 53px;height: 5.3rem;margin: 0px 0 0px;padding: 0 24px; font-size: 1.8rem; letter-spacing: 0.02em; line-height: 53px; line-height: 5.3rem; text-align: center; text-decoration: none; color: white; transition: background-color 0.2s ease-out 0s; border-radius: 7px; text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5); -webkit-box-shadow: inset 0px -3px 0px 0px rgba(50, 50, 50, 0.2); -moz-box-shadow: inset 0px -3px 0px 0px rgba(50, 50, 50, 0.2); box-shadow: inset 0px -3px 0px 0px rgba(50, 50, 50, 0.2); background: rgb(10, 161, 80); width:500px;margin:0 auto;display:block; border: 1px solid #ccc;" href="./" class='hover'>
Вернуться на сайт</a>
<style>
.hover:hover {
	background:#08793d !important;
	transition:all .3s ease-in-out;
}
</style>

</body>
</html>
<?
}else{
    echo "no";
}
}
?>
