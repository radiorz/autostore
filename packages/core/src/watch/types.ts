import type { StateOperateParams, StateOperates } from "../store/types"
import type { WatchObject } from "./watchObject"
import type { EventListener } from "../events/emitter"
import { ObserverDescriptor, ObserverDescriptorBuilder, ObserverOptions } from "../observer/types"

export type WatchListener<T=any,P=any> = (operate:StateOperateParams<T,P>)=>void

export type WatchListenerOptions = {
    once?    : boolean                                      // 只侦听一次后自动移除
    operates?: '*' | 'read' | 'write' | StateOperates[]     // 只侦听的操作类型
    filter?  : (args:StateOperateParams)=>boolean           // 过滤器
}
export type Watcher = EventListener


export type WatchDependFilter<Value=any> = (path:string[],value:Value)=>boolean     

  

export interface WatchOptions<Value=any> extends ObserverOptions<Value>  { 
    async?  : false                        
    filter : WatchDependFilter<Value>     
}

export type WatchScope<Value=any> = {
  path : string[],
  value: Value
}

export type WatchGetter<Value=any,DependValue= any> = (
    scope: {path:string[],value:DependValue},
    args : WatchObject<Value>
)=>Exclude<any,Promise<any>> | undefined

export type WatchDescriptor<Value=any, Scope extends WatchScope=WatchScope> = ObserverDescriptor<
  'watch',
  Value,
  Scope,
  WatchGetter<Value,Scope>,
  WatchOptions<Value>
>

/**
 * @template Value  监听函数的返回值类型
 * @template Scope 监听函数的第一个参数的类型
 */
export type WatchDescriptorBuilder<Value = any>
  = ObserverDescriptorBuilder<'watch',Value,WatchScope,WatchDescriptor<Value,WatchScope>> 



