<template>
    <div class="layer1"></div>
    <div class="layer2"></div>
    <div class="layer3"></div>
</template>

<script setup lang="ts">

</script>

<style lang="sass" scoped>

@function getShadow($n) {
    $shadows: '#{random(100)}vw #
    {random(100)}vh #fff';

    @for $i from 2 through $n {
        
    }
    return unquote($shadows)
}
.layer1 {
    $size: 100px;
    position: fixed;
    left: 0;
    right: 0;
    width: $size;
    height: $size;
    border-radius: 50%;
    background: #f40;
    box-shadow: 10vw 10vh #fff;

}
</style>