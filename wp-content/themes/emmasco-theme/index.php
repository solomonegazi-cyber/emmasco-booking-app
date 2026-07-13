<?php
/**
 * Emmasco Theme Fallback Index
 *
 * @package Emmasco_Theme
 */

get_header();
?>

<div class="max-w-4xl mx-auto px-4 py-24 text-left">
    <div class="bg-white dark:bg-slate-950 p-12 rounded-3xl border border-blue-50/50 dark:border-slate-800 shadow-sm">
        <h1 class="text-2xl font-black text-slate-850 dark:text-white mb-6">Archive & Fallback</h1>
        <p class="text-slate-500 text-xs mb-8">System fallback query. Please edit this page in the WordPress admin dashboard.</p>
        
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="px-6 py-3 bg-[#0056D6] hover:bg-[#0047b3] text-white text-xs font-black rounded-xl">
            Zur Startseite zurückkehren
        </a>
    </div>
</div>

<?php
get_footer();
