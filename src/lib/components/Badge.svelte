<script lang="ts">
	type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

	interface BadgeProps {
		variant?: Variant;
		class?: string;
	}

	let className: string = '';
	export { className as class };
	export let variant: Variant = 'default';

	const variantStyles: Record<Variant, string> = {
		default: 'bg-primary text-primary-foreground hover:bg-primary/80',
		secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
		destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
		outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground'
	};
</script>
