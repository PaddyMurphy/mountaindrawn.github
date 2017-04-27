<template>
	<a :href="photo.lg" v-on:click.stop>
	  <img :src="photo.src">
	</a>
</template>

<script>
export default {
  name: 'photos',
  props: ['photo']
}
</script>
