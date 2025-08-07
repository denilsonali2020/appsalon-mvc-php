<?php

namespace  Controllers;

use MVC\Router;


class CitaController {
    
    public static function index (Router $router) {        
        
        if(session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        isAuth();//verificamos si esta autenticado si no lo esta no puede acceder a /citas

        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id'],
        ]);
    }   
}