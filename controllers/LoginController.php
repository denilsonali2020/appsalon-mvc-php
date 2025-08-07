<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController{

    public static function login(Router $router){
        $alertas = [];        

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarLogin();

            if(empty($alertas)) {
                //Comprobar que exista el usuario
                $usuario = Usuario::where('email', $auth->email);
                
                if($usuario) {
                    //Veryficar el password
                    if($usuario->comprobarPasswordAndVerificado($auth->password)) {
                        //autenticar al usuario
                        if (session_status() === PHP_SESSION_NONE) {
                            session_start();
                        }

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . ' ' . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        //redireccionamieinto                        
                        if($usuario->admin === "1") {                            
                            $_SESSION['admin'] = $usuario->admin ?? null;

                            header('Location: /admin');
                        } else {
                            header('Location: /cita');
                        }
                        
                    }
                } else {
                    Usuario::setAlerta('error', 'Usuario no encontrado');
                }
            }
        }        

        $alertas = Usuario::getAlertas();

        $router->render('auth/login', [
            'alertas' => $alertas,            
        ]);
    }

    public static function logout(){
        if(session_status() === PHP_SESSION_NONE) {
            session_start();
        }        
        session_unset(); // Elimina todas las variables de sesión
        session_destroy();

        header('Location: /');
    }

    public static function olvide(Router $router){
        
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarEmail();
            
            if(empty($alertas)) {
                $usuario = Usuario::where('email', $auth->email);

                if($usuario && $usuario->confirmado === "1") {
                    //generar un token de un solo uso
                    $usuario->crearToken();
                    $usuario->guardar();
                    
                    //enviar email
                    $email= new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();

                    //ALETRA
                    Usuario::setAlerta('exito', 'Revisa tu email');                    
                } else {
                    Usuario::setAlerta('error', 'El usuario no existe o no esta confirmado');                    
                }
            }
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/olvide-password', [
            'alertas' => $alertas,
        ]);
    }

    public static function recuperar(Router $router){
        $alertas = [];
        $error = false;
        $token = s($_GET['token']);
        
        //Buscar usuario por su token
        $usuario = Usuario::where('token', $token);


        if(empty($usuario)) {
            Usuario::setAlerta('error', 'Token No Válido');
            $error = true;            
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            //Leer el nuevo password y guardarlo
            $password = new Usuario($_POST);
            $alertas = $password->validarPassword();

            if(empty($alertas)) {
                $usuario->password = null;
                $usuario->password = $password->password;
                $usuario->hashPassword();
                $usuario->token = '';

                $resultado = $usuario->guardar();
                
                if($resultado) {
                    header('Location: /');
                }                
            }
        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/recuperar-password' ,[
            'alertas' => $alertas,
            'error' => $error,
        ]);
    }

    public static function crear(Router $router){
        $usuario = new Usuario;

        //Alertas vacias
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST'){            
            //Para que los datos escritos no se pierdan
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();
            
            //Revisar que alertas este vacio
            if(empty($alertas)){
                //Verificar que el usuario no esta registrado
                $resultado = $usuario->existeUsuario();

                if($resultado->num_rows){
                    $alertas = Usuario::getAlertas();
                }else{
                    //Hashear el password
                    $usuario->hashPassword();
                    //Generar un Token unico
                    $usuario->crearToken();
                    //Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarConfirmacion();

                    //Crear el usuario                    
                    $resultado = $usuario->guardar();
                    if($resultado) {
                        header('Location: /mensaje');
                    }                                        
                }
            }
        }

        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas

        ]);
    }


    public static function mensaje(Router $router){ 
        $router->render('auth/mensaje');
    }


    public static function confirmar (Router $router) {
        $alertas = [];           
        $token = s($_GET['token']);
        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            //mostrar mensaje de error
            Usuario::setAlerta('error', 'Token No Válido');
        } else {
            //modificar a usuario confirmado
            $usuario->confirmado = "1";
            $usuario->token = '';
            $usuario->guardar();
            Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
        }
        
        $alertas = Usuario::getAlertas();
        $router->render('auth/confirmar-cuenta',[
            'alertas' => $alertas
        ]);
    }
}