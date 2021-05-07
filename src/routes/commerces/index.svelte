<script context="module">
	export async function preload() {
		const _A = await (await this.fetch(`${API}${COMMERCES}${OPTIONS}`)).json();
		const A = _A.sort((a,b) => (a.title.raw > b.title.raw) ? 1 : ((b.title.raw > a.title.raw) ? -1 : 0));
		return { A };
	}
</script>
<script>
//import Snackbar from 'svelma-pro/src/components/Snackbar/Snackbar.svelte'
import { mobileViewport, selectedItem, isBigArray } from '../../utils/stores.js';
import List from '../../components/List.svelte';
import Map from '../../components/Map.svelte';
import Events2 from '../../components/Events2.svelte';
import Modal from '../../bits/Modal.svelte'
import { onMount } from 'svelte';
import {getPlaces, API, COMMERCES, OPTIONS } from '../../utils/consts.js';
import { fly } from 'svelte/transition';

export let name = "tavernasso"

export let A; 
let ABackup; // <-- A : Données principales, 95% data des différents lieux
let ready = false;
let toggle = "commerces";
let reset=false;
let filtrage=false;
let fireForm = false;
let isFocused = false;
let toggleMenu = false;
let mapContainer;
let weather = []

	onMount(async () => {	
		//makeCategories("events").then((e) => console.log(e));
		$mobileViewport.mob = window.matchMedia("(max-width: 768px)"); 
		$mobileViewport.touch = window.matchMedia("(max-width: 1024px)"); 
		ABackup = [...A];
		if (toggle=="events") 
			A = A.sort((a, b) => Date.parse(a.start_date.raw) - Date.parse(b.start_date.raw));
		isBigArray.set(Array(A.length).fill(false));
		ready=true;
	});

	function handleSwitch (e) {

		reset=false;

		if (e.detail.text == 'update') {	
			ready = false;
			A = [...ABackup];

			if ($selectedItem && $selectedItem.type == 'category')
				A = A.filter(item => item.default_category == $selectedItem.id)
			else if ($selectedItem && $selectedItem.type == 'place')
				A = A.filter(item => item.id == $selectedItem.id)
			ready=true;
		}

		else if(e.detail.text == 'filtredate') {	
			ready = false;
			let  dates = e.detail.mode;
			A = [...ABackup];
			A = A.filter(item => Date.parse(item.start_date.raw) >= Date.parse(dates.start) && Date.parse(item.start_date.raw) <= Date.parse(dates.end));
			ready=true;
		}

		else if (e.detail.text == 'form') {	
			fireForm=true;
		}
		else if (e.detail.text == 'reset') {
			A = [...ABackup];
			$selectedItem = false;
		}

		else {
			ready=false;
			reset=true;
			toggle = e.detail.mode;

			getPlaces(toggle).then((p) => {
				A = p;
				if (toggle=="events") A = A.sort((a, b) => Date.parse(a.start_date.raw) - Date.parse(b.start_date.raw));
				ABackup = A;
				//console.log(A);
				$isBigArray = [];
				ready = true;
			});
		}
	}

	function fireSnack(props) {
		//Snackbar.create({ message: 'Votre message a bien été envoyé', ...props })
	}

</script>

	{#if !ready}

		<div class="spincontainer" out:fly="{{ y:2000, duration: 1200 }}">
			<div class="loadermax"></div>
			<div class = "break"></div>
			<h1 class="is-size-3 is-size-5-touch has-text-white prout">Récupération des données</h1>
		</div>
	{:else}
	<div class="container">

		{#if fireForm}
			<Modal on:close="{() => fireForm = false}" closeText = "Annuler et revenir" title="Faisons connaissance" width="40vw" bind:active={fireForm}>
				<Formidable on:fireSnack={() => fireSnack(e => e.detail.props)} bind:fireForm />
			</Modal>
		{/if}	
		
		<div class="columns" on:click|passive={()=>toggleMenu=false}>
			{#if toggle != "events"}
				<div class="paneman leftman" on:click={()=>isFocused=true}>
					<List {A} bind:toggle />
				</div>
				<div class="paneman rightman" on:click={()=>isFocused=false}>
					<Map bind:A bind:reset {toggle} />
				</div>
			{:else}
				<div class="paneman bigleft" on:click={()=>isFocused=true}>
					<Events2 bind:A bind:reset {mapContainer} {weather} />
				</div>
				<div class="paneman smallright" on:click={()=>isFocused=false} bind:this={mapContainer}>
					<Map bind:A bind:reset {toggle} />
				</div>
			{/if}
		</div>
	</div>
	{/if}

