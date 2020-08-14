function falarDepoisDe(segundos, frase) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(frase)
        }, segundos * 1000)
    })
}

falarDepoisDe(1, "olá")
.then(frase => frase.concat("!!!"))
.then(frase => frase.concat("!!!", a))
.then(outraFrase => console.log(outraFrase))
let a = " - teste"
a = "adskll;sa"
console.log(a)


