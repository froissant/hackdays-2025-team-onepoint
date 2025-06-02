/**
 * MemeTemplate
 * 
 * Represents a meme template available for meme generation.
 * Contains information about the template's ID, name, a blank image URL, and an example meme.
 */
export default interface MemeTemplate {
    
    /**
     * Unique identifier for the meme template.
     */
    id: string;

    /**
     * Human-readable name of the meme template.
     */
    name: string;

    /**
     * URL to the blank version of the meme template image.
     */
    blank: string;

    /**
     * Example meme generated from this template.
     */
    example: {
        /**
         * URL to the example meme image.
         */
        url: string;
    };
}