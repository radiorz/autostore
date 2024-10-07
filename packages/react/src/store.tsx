import { AutoStore, Dict, AutoStoreOptions } from "autostore";
import { createUseState } from "./hooks/useState";
import { createUseDeps } from "./hooks/useDeps";
import { createSignalComponent } from "./signal";
import type { SignalComponentType } from "./signal/types";
import { createInputBinding } from './form/bind';
import { InputBindingsType } from './form/types';
import { createUseInput } from './hooks/useInput';
import { UseDepsType, UseInputType, UseStateType, UseWatchType, UseFormBindingsType } from './hooks/types';
import { createUseWatch } from './hooks/useWatch';
import { createUseFormBindings } from './hooks/useFormBindings';

export class ReactAutoStore<State extends Dict> extends AutoStore<State>{
    useState:UseStateType<State>
    useDeps:UseDepsType<State>
    $:SignalComponentType<State>
    signal:SignalComponentType<State>
    bind:InputBindingsType
    useInput:UseInputType<State>
    useWatch:UseWatchType
    UseFormBindings:UseFormBindingsType<State>
    constructor(initial: State,options?:AutoStoreOptions<State>){
        super(initial,options)
        this.signal = this.$ = createSignalComponent(this).bind(this)
        this.useState = createUseState(this).bind(this)
        this.useDeps = createUseDeps(this).bind(this)
        this.useInput = createUseInput(this).bind(this)
        this.bind = createInputBinding(this).bind(this)
        this.useWatch = createUseWatch(this).bind(this)
        this.UseFormBindings = createUseFormBindings(this).bind(this)
    } 
} 

export function createStore<State extends Dict>(initial: State,options?:AutoStoreOptions<State>){
    return new ReactAutoStore<State>(initial,options);
}
 