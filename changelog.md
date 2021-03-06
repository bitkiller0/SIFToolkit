v0.1.2  07/20/2021

* Initial release
* Code Restructuring
* Added ability to add sound effects to Damage rolls/Template Placement.
* Added ability to reuse chat card buttons.
* Modified code to support new requirements of all lower-case package names.

v0.1.3 07/20/2021

* Updated manifest URL.

v0.1.5 07/21/2021

* removed debug code.

v0.1.8 07/21/2021

* added error checking for SIFData missing from objects.

v0.1.10 07/21/2021

* fixed bugs in migration script and renderChatMessage null object checking.

v0.1.11 07/21/2021

* fixed error checking entry on template button hijack for dnd5e
* added some additional error checks

v0.1.12 07/22/2021

* corrected bugs affecting Special Effects tab rendering on wrong itemSheet
* corrected bugs affecting changes to one itemSheet causing all other itemSheets to update with the same value.
* corrected bug on itemSheet causing scroll position to reset on itemSheet during re-render.

v0.1.13 07/22/2021

* updated version number

v0.1.14 07/22/2021

* updates due to bad commit.  

v0.1.15 07/23/2021

* updated item sheet template URL to be case specific.  

v0.1.16 07/23/2021

* fixed bug in dnd5e hooks that would under some circumstances prevent hooks from loading.

v0.1.17 07/23/2021

* updated item sheet template filename to match script request.  

v0.1.18 7/27/2021

* corrected background error in updateMeasuredTemplate hook that would occur when updating a measured template with no SIFT data attached.  
* corrected error in Hooks.js that could cause some Hooks to not be loaded.  
* removed some debug code.

v0.1.19 7/28/2021

* Added check for missing SIFData in updateTemplate code.  

v0.1.20 7/28/2021

* corrected typo preventing PF2E hooks from loading.

v0.1.21 7/28/2021

* corrected bug causing no SIF data to be appended to templates: this prevented hover information from displaying correctly.
* corrected multiple bugs in template processing that would /not allow selective deletion of templates by GM/players.  Errors would cause templates to display incorrectly
* corrected bug causing errors to be thrown when the primary user (not GM) rendered a chat message with hijackable button.

v0.1.22 7/28/2021

* added missing logic to remove templates for which ignoreDuration is checked early if appropriate, but not before spellFadeDuration has been reached.

v0.1.23 07/28/2021

* adjusted Ray animation code to allow for non-5-foot squares

v0.1.24 07/30/2021 

* corrected bug in PF2E preventing SIF data from being passed to templates.

v0.1.25 07/31/2021

* re-introduced code to allow management of unmanaged templates

v0.1.26 07/31/2021

* added changes to account further for some SIFs that are missing SIFT information.  

0.1.27 07/31/2021

* Reapplied code from 0.1.25 which was inadvertantly removed in 0.1.26 due to a bad merge.

0.1.28 08/01/2021

* fixed bug preventing propper attribution of S/I/F details to templates when used by non-GM users. 

0.1.29 09/18/2021

* Added button to Measurement Controls to allow freeing of special effects data
* prevented version pop-up for non-GM players

0.1.30 10/7/2021

* Bug Fixes
* Added Support for Better Rolls for DND5E

0.1.31 10/7/2021

* Added Support for Tidy5e dark theme

0.1.32 10/7/2021

* Bug fix for issue #24 generating error when placing templates for linked actors without SIFData attached.

0.1.33 10/7/2021

* Additional bug fixes for issue #24 and fixes for errors generated on chat messages that do not include SIFs

0.1.34 10/7/2021

* Removed debug code.

0.1.35 10/8/2021

* Additional bug fixes related to generation of default sound data.  
* Added additional error checking.

0.1.36 10/10/2021

* Bug fix to prevent error message when messages appear that the user does not have permission to modify

0.1.37 10/12/2021

* Corrected bug preventing loading of some functions on Forge-VTT
* updated logic to better identify the correct S/I/F in use.

0.1.38 10/12/2021

* Updated Template Cleanup code to only LOG messages regarding scene cleanups when SIFT takes an action against a scene, rather than simply evaluating the scene for cleanup.
* removed debug code
* Fixed Broken unknown message parsing

0.1.39 10/12/2021

* Improved chat log parsing on reload
* Added additional logic for identifying the button clicked for unknown messages, rather than just the panel that the button is on.
* Removed debug code

0.1.40 10/14/2021

* corrected most recent chat message on reload
* bug fix to present correct text for Concentration Spell Template Color in settings
* Added option to play audio on saving throws
* changed logic for BetterRolls to fire audio for save button based on new save setting rather than Damage Setting
* corrected changelog documentation to correctly reflect all items in v0.1.39
* Updated support for PF2E
* Added support for Weapon Objects
* Removed Debug Code

0.1.41 10/18/2021

* Corrected bug preventing parsing of unknown messages in DND5E when no flavor text was present. 

0.1.43 10/18/2021

* removed test code
* tested with Foundry v9.226

0.2.1 10/18/2021

* Added support for removing templates of tokens when removed from combat and/or scene.
* SIFT logic is now based on tokens, rather than actors, allowing multiple tokens with the same actor to have separate concentration templates.
* Removed Debug Code

0.2.2 10/19/2021

* Added setting for default option when a combatant/token is removed.

0.2.3 10/19/2021

* Fixed "Forge" breaking bugs
* Fixed default setting bug for combatant/token removal
* Fixed tooltip failover when token has been deleted

0.2.4 10/19/2021

* Fixed version control bug

0.2.5 10/21/2021

* Fixed item-sheet CSS Style bleed
* Updated dnd5e item-sheet look and feel to use consistent file select buttons
* Fixed bug in migration script that could halt migration for some templates.

0.3.1 10/21/2021

* Fixed checkbox alignment issue on default dnd5e item-sheet
* Fixed bug preventing reload of textures on scene change
* NEW FEATURE: Disable Grid Highlights.  Highlight reappears when user hovers over template's control icon.

0.4.1 10/21/2021

* NEW FEATURE: Disable Template Borders.  Borders reappear when user hovers over a template's control icon.
* New FEATURE: Disable Measurement Text.  Text reappears when user hovers over a template's control icon.
* New Option: Disable ToolTip.  The existing Template tooltip can now be disabled in settings.  

0.4.2 10/22/2021

* Corrected bug preventing Disable Borders from working on first setup.
* Removed Debug Code

0.4.3 10/22/2021

* Removed Debug Code
* Fixed bug causing Disable Borders to prevent initial load of textures