
export const cartOpen = $state({
    isOpen: false
});

export function openCart() {
    document.getElementById('dropdown-trigger')?.click();
};