/*
 * Collection of all Controllerly relevant events.
 */

export const EVENT_BUTTON_EVENT: string = 'buttonEvent';

export enum ButtonEventType {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    /**
     * A short tap.
     */
    TAP = 'tap',
    LONGPRESS = 'longPress',
    SWIPE_UP = 'swipeUp',
    SWIPE_LEFT = 'swipeLeft',
    SWIPE_RIGHT = 'swipeRight',
    SWIPE_DOWN = 'swipeDown'
}

export interface ButtonEvent {
    /**
     * Name of the button.
     */
    name: string;
    /**
     * Type of action.
     */
    type: ButtonEventType;
    pressed: boolean;
    /**
     * Time of occurens.
     */
    timestamp: number;
}