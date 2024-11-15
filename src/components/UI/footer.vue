<script setup>
import IconMain from '@/components/icons/IconMain.vue'
import IconRef from '@/components/icons/IconRef.vue'
import IconTask from '@/components/icons/IconTask.vue'

defineEmits(['refOpen'])
</script>

<template>
    <footer>
        <div class="another">
            <button>Join earlyer</button>
        </div>
        <nav class="bar">
            <div style="display: grid;align-items: center;justify-content: center;background: #000000;border-radius: 10px;padding: 3px;">
                <IconTask />
            </div>
            <div style="display: grid;align-items: center;justify-content: center;background: #000000;border-radius: 10px;padding: 3px;">
                <IconMain />
            </div>
            <div style="display: grid;align-items: center;justify-content: center;background: #000000;border-radius: 10px;padding: 3px;" @click="$emit('refOpen')">
                <IconRef />
            </div>
        </nav>
    </footer>
</template>

<style scoped>
footer {
    position: absolute;
    z-index: 100;
    bottom: 0;
    width: 100vw;
    min-height: 120px;
    backdrop-filter: blur(1px);
    display: grid;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.another {
    display: grid;
    align-items: center;
    justify-content: center; 
}

.bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25%;
    width: 100vw;
    padding: 10px;
    background: #000000;
    box-shadow: 0px 9px 13px 12px #000;
}

.another button {
    height: fit-content;
    padding: 10px;
    width: 80vw;
    border: 0;
    background: #6bfe07;
    border-radius: 10px;
    font-size: 17px;
    font-family: Inter;
    font-weight: 600;
    border-bottom: 5px solid #088139;
    color: #0e0e0e;
}
</style>