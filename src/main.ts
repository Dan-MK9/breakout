import { Actor, CollisionType, Color, Engine, Font, Text, vec } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo
const game = new Engine({
	width: 800,
	height: 600
})

// 2 - Criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40, // game.drawHeight
	width: 150,
	height: 20,
	color: Color.Chartreuse,
	name: "BarraJogador"
})

// Define o tipo de colisão da barra
// CollisionType.Fixed = Significa que ele não irá se "mexer" quando colidir
barra.body.collisionType = CollisionType.Fixed

// Insere o Actor barra - player, no game
game.add(barra)


// 3 - Movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	// Faz a posição x da barra, ser igual a posição x do mouse
	barra.pos.x = event.worldPos.x
})

// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

// 5 - Criar movimentação da bolinha
const velocidadeBolinha = vec(400, 400)

// Apos 1 segundo (1000 ms), define a velocidade da bolinha em x = 100 = e y = 100
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

// 6 - Fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}

	// Se a bolinha colidir com o lado direito 
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x
	}
	// Se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}
	//  Se a bolinha colidir com a parte inferior
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	bolinha.vel.y = -velocidadeBolinha.y
	// }
})

// Insere a bolinha no game
game.add(bolinha)

// 7 - Criar blocos
// Configuração de tamanho e espaçamento dos blocos
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Renderização dos bloquinhos

for (let j = 0; j < linhas; j++) {
	// Renderiza 5 bloquinhos
	for (let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}
}

listaBlocos.forEach(bloco => {
	// define o tipo de colisor de cada bloco
	bloco.body.collisionType = CollisionType.Active

	// adiciona cada bloco no game
	game.add(bloco)
})

// Adicionando pontuação
let pontos = 0

const textoPontos = new Text({
	text: `Pontos: ${pontos}`,
	font: new Font({size: 20})
})

const objetoTexto = new Actor({
	x: game.drawWidth - 80,
	y: game.drawHeight - 15
})

objetoTexto.graphics.use(textoPontos);
objetoTexto.body.collisionType = CollisionType.PreventCollision;

game.add(objetoTexto)

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
	// Verificar se a bolinha colidiu com algum bloco destrutivel
	console.log("Colidiu com ", event.other.name);

	// Se o elemento colidido for um bloco da lista de blocos (destruidos)
	if (listaBlocos.includes(event.other) ) {
		// Destruir o bloco colidido
		event.other.kill()

		// Aumenta a pontuação
		pontos += 100;

		// Atualiza a pontuação na tela
		textoPontos.text = `Pontos: ${pontos}`
	}

	// Rebater a bolinha - Inverter as direções
	let interseccao = event.contact.mtv.normalize()

	// Se não esta colidindo
	// !colidindo -> colidindo == false
	if (!colidindo) {
		colidindo = true

		// Interseccao.x e interseccao.y
		// O maior representsa o eixo onde houve o contato
		if( Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
			// bolinha.vel.x = -bolinha.vel.x
			// bolinha.vel.x *= -1
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			// bolinha.vel.y = -bolinha.vel.y
			// bolinha.vel.y *= -1
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}
}) 

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	alert("Noob")
	window.location.reload()
})

// Inicia o game
game.start()