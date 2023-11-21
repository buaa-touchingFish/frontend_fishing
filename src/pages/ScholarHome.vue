<template>
    <div class="rootDiv">
        <div class="scholarDiv">
            <div class="imageDiv">
                <n-avatar round :size="128"
                    src="https://x0.ifengimg.com/res/2020/79AF4AE1EC8333953CBE4B3B3D0529A6E1FB6186_size217_w1080_h1171.jpeg" />
                <n-button>我要认领</n-button>
            </div>
            <div class="verticalSplitDiv"></div>
            <div class="infoDiv">
                <div class="nameDiv">
                    <span class="nameSpan">丁真珍珠</span>
                    <span class="idSpan">scholarID:10010</span>
                </div>
                <span class="briefInfo">四川省甘孜藏族自治州理塘县 理塘王</span>
                <div class="infoDataDiv">
                    <div class="infoDataBoxDiv">
                        <span class="infoBoxTitleSpan">被引次数</span>
                        <span class="infoBoxValueSpan">1010</span>
                    </div>
                    <n-divider vertical></n-divider>
                    <div class="infoDataBoxDiv">
                        <span class="infoBoxTitleSpan">成果数</span>
                        <span class="infoBoxValueSpan">1</span>
                    </div>
                    <n-divider vertical></n-divider>
                    <div class="infoDataBoxDiv">
                        <span class="infoBoxTitleSpan">被关注数</span>
                        <span class="infoBoxValueSpan">1.3W</span>
                    </div>
                    <n-divider vertical></n-divider>
                    <div class="infoDataBoxDiv">
                        <span class="infoBoxTitleSpan">热度</span>
                        <span class="infoBoxValueSpan">+∞</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="horizontalSplitDiv" />
    </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.verticalSplitDiv {
    width: 1px;
    height: 50%;
    background-color: gainsboro;
    align-self: center;
}

.horizontalSplitDiv {
    width: 95%;
    height: 1px;
    background-color: gainsboro;
    align-self: center;
}

.rootDiv {
    width: 80%;
    min-width: 720px;
    display: flex;
    flex-direction: column;
}

.scholarDiv {
    height: 260px;
    display: flex;
    flex-direction: row;
}

.imageDiv {
    width: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 40px;
}


.infoDiv {
    width: calc(100% - 160px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    padding: 20px;

}

.nameDiv {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
}

.nameSpan {
    font-size: 22pt;
    font-weight: bold;
    min-width: max-content;
}

.idSpan {
    margin-left: 300px;
}

.infoDataDiv {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    justify-content: start;
    align-items: center;
}

.infoDataBoxDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
}

.infoBoxTitleSpan {
    font-weight: lighter;
}

.infoBoxValueSpan {}
</style>