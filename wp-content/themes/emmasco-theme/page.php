<?php
/**
 * Emmasco Theme Standard Page template
 *
 * @package Emmasco_Theme
 */

get_header();
?>

<!-- Secondary Header area representing sub-context -->
<div class="relative py-16 bg-[#F6FAFF] dark:bg-slate-900 transition-all duration-300 overflow-hidden border-b border-blue-50/50 dark:border-slate-800">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
    <div class="max-w-4xl mx-auto px-4 text-center space-y-3 relative">
        <h1 class="text-3xl sm:text-4xl font-black text-slate-850 dark:text-white tracking-tight">
            <?php the_title(); ?>
        </h1>
        <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Emmasco • Legal Information & Articles
        </p>
    </div>
</div>

<!-- Inner page body content -->
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
    <div class="bg-white dark:bg-slate-950 p-8 sm:p-12 rounded-3xl border border-blue-50/50 dark:border-slate-800 shadow-minimal transition-all text-slate-700 dark:text-slate-300 leading-relaxed font-serif space-y-6">
        
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post();
                the_content();
            endwhile;
        else :
            ?>
            <p class="font-sans text-xs text-slate-400 text-center" data-translate="noPageContent">Keine Inhalte für diese Seite gefunden.</p>
            <?php
        endif;
        ?>

    </div>
</div>

<?php
get_footer();
