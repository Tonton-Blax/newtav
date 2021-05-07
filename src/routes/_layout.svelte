<svelte:head>
	<link href='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css' rel='stylesheet' />
	<link rel="preconnect" href="https://fonts.gstatic.com">

	<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,400;0,600;0,700;0,900;1,300&display=swap" rel="stylesheet">
</svelte:head>

<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	@import '../styles/global.sass';

	main {
		background-color: white;
		padding: 0em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>