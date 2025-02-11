document.getElementById("sun").style.display = "none";
document.getElementById("moon").style.display = "block";    
document.getElementById("dark-light").addEventListener("click", function () {
    if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.getElementById("sun").style.display = "block";
        document.getElementById("moon").style.display = "none";
    } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.getElementById("sun").style.display = "none";
        document.getElementById("moon").style.display = "block";
    }
});

let mostrado = false; // Variable de control

document.getElementById("perfil").style.opacity = "0";
const header = document.getElementById("header");

document.addEventListener("scroll", function () {
    if (window.scrollY > 235 && !mostrado) {
        mostrado = true;
        document.getElementById("perfil").style.animation = "none";
        document.getElementById("perfil").style.animation = "fade-in 0.5s forwards";
        header.classList.remove("justify-end");
        header.classList.add("justify-between");
    } else if (window.scrollY <= 220 && mostrado) {
        mostrado = false;
        document.getElementById("perfil").style.animation = "none";
        document.getElementById("perfil").style.animation = "fade-out 0.5s forwards";
        setTimeout(() => {
            header.classList.add("justify-end");
            header.classList.remove("justify-between");
        }, 500);
    }
});

document.getElementById("copy-email").addEventListener("click", function () {
    navigator.clipboard.writeText("contacto@tecnobros.es");
    document.getElementById("copy-email-tooltip").textContent = "¡Copiado!";

    setTimeout(() => {
        document.getElementById("copy-email-tooltip").textContent = "Copiar correo";
    }, 1000);
});
