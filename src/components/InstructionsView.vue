<template>
	<div id="window" class="instruction-window" :style="{left: `${left}vw` }">
		<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet">
		<div id="sections">
			<div id="move-ship" class="single-section">
				<h2 class="title-text">
					NAVIGATE
				</h2>	
				
				<div class="flex-horizontal">
					<h3 class="bold-text">TAP OR CLICK</h3>
					<img id="move-ship-btns" src="../assets/MoveShipBtns.png" alt="">
				</div>
				<h5 class="bold-text">-or-</h5>
				<h3 class="keyboard bold-text">USE ARROW KEYS</h3>

			</div>
			<div id="fire-blaster" class="single-section">
				<h2 class="title-text">
					FIRE!
				</h2>	
				<div class="flex-horizontal bold-text">
					<h3 class="bold-text">TAP OR CLICK</h3>
					<img id="move-ship-btns" src="../assets/laser-ball-100.png" alt="">
				</div>
				<h5 class="bold-text">-or-</h5>
				<h3 class="keyboard bold-text">USE SPACE BAR</h3>
			</div>
		</div>
		<div id="ok" class="bold-text" @click="closeWindow">
			OK!
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const emit = defineEmits(['closeInstructions']);
const left = ref(0);

async function closeWindow() {
	for (let i = 12; i > -90; i--) {
		left.value = i;
		await new Promise((r) => setTimeout(r, 5));
	}
	emit('closeInstructions'); 
}

onMounted(async () => {
	for (let i = -80; i <= 7; i++) {
		left.value = i;
		await new Promise((r) => setTimeout(r, 2));
	}
});
</script>

<style scoped>
	.instruction-window {
		position: fixed;
		top: 5vh;
		left: 5vw;
		z-index:105;
		opacity: 90%;
		font-family: Monoton;
		font-size: 3vw;
		font-weight: bold;
		padding: 2vw;
		color: rgba(28, 28, 28, 0.616);
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10vw 5vw 10vw 5vw;
		border: solid 1vw;
		background-color: rgb(215, 215, 215);
	}

	h2 {
		font-size: 90%;
	}

	img {
		margin-left: 2%;
		border-radius: 3vw;
	}

	#sections {
		display: flex;
		justify-content: center;
		/* height: 90%; */
	}

	.single-section {
		border: solid;
		border-radius: 10vw 5vw 10vw 5vw;
		padding: 0vw 5vw;
		width: 40vw;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#move-ship {
		margin-right: 1%;
	}
	.title-text {
		font-size: 4vw;
		color: red;
		margin: 1vw 0vw 0vw 0vw;
		font-weight: bold;
	}

	.bold-text {
		font-weight: bold;
	}

	#move-ship-btns {
		height: 80%;
	}
	#fire-blaster {
		margin-left: 1%;
	}
	h3 {
		font-size: 2vw;
	}

	h5 {
		margin-top: 1%;
		margin-bottom: 1%;
		font-size: 80%;
	}

	.keyboard {
		border: solid;
		border-radius: 10vw 5vw 10vw 5vw;
		margin-top: 1%;
		/* margin-bottom: 1%; */
		margin-bottom: 0px;
		width: 30vw;
		text-align: center;
	}
	.flex-horizontal {
		display: flex;
		align-items: center;
		margin-top: 4%;
		margin-bottom: 4%;
		height: 40%;
	}

	#ok {
		border: solid;
		border-radius: 5vw;
		margin-top: 1%;
		margin-bottom: 2%;
		width: 10vw;
		font-size: 5vh;
		background-color: rgba(0, 128, 0, 0.253);
		text-align: center;
	}

	#ok:hover {
		cursor: pointer;
		opacity: 70%;
	}



</style>