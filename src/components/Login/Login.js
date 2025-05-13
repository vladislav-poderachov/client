import React from "react";
import {Typography, TextField, Paper, Button, Grid} from "@mui/material";
export const Login=()=>{
return(
    <Paper classes={{root: styles.root}}>
        <Typography classes={{root: styles.title}}>
            Вход в аккаунт
        </Typography>
        <TextField className={styles.field} label={Логин} error helperText={"Неверно указан логин"} fullWidth/>
        <TextField className={styles.field} label="Пароль" fullWidth/>
        <Button size={"large"} variant={"contained"} fullWidth>Войти</Button>
    </Paper>
)
}
