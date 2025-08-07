<div class="campo">
    <label for="nombre">Nombre</label>
    <input 
        type="text" 
        id="nombre" 
        name="nombre" 
        placeholder="Nombre Servicio"
        value="<?php echo $servicio->nombre; ?>" 
        autocomplete="off">
</div>

<div class="campo">
    <label for="precio">Precio</label>
    <input 
        type="number" 
        id="precio" 
        name="precio" 
        placeholder="Precio Servicio"
        <?php 
    $precio = rtrim(rtrim($servicio->precio, '0'), '.');
?>
<input type="text" name="precio" value="<?php echo $precio; ?>">

</div>