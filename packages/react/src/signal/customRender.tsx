import {  AsyncComputedValue, Dict, isAsyncComputedValue, PATH_DELIMITER } from "@autostorejs/core"
import type { ReactAutoStore } from "../store"
import React, { useEffect, useMemo, useState } from "react"
import { getValueBySelector } from "../utils/getValueBySelector"
import type { SignalComponentRender } from "./types"

/**
 * 
 * 通过渲染函数创建一个信号组件
 * 
 * 
 * 
 * @example
 * 
 * import { createStore } from "@autostorejs/react"  
 * 
 * const { state, $ } = createStore({
 *    order:{
 *      price: 100,
 *      count:1,
 *      total: computed(async (user)=>{
 *          return user.price + ' ' + user.count
 *      },["price","count"])
 *    }
 * })
 * 
 * @example
 * 
 *   指定字符串路径，然后自定义渲染函数
 *   $(({value,timeout,loading})=>{
 *      return <div>{value}</div>
 *   },"order.total")
 *   需要注意的是，只有当order.total是一个异步计算属性时，才会有timeout,loading属性
 * 
 *   
 * 
 */
export function createCustomRender<State extends Dict>(store:ReactAutoStore<State>,render:SignalComponentRender,path: string | string[]){
    return React.memo(()=>{ 
        const [ value,setValue ] = useState(()=>getValueBySelector(store,path))  
        const isAsync:boolean  = isAsyncComputedValue(value) 

        const renderArgs = useMemo<AsyncComputedValue>(()=>{
            return isAsync ? value : { value } as AsyncComputedValue
        },[value])

        const deps = store.useDeps(path,false)

        useEffect(()=>{ 
            const watchPath = isAsync ? `${Array.isArray(path) ? path.join(PATH_DELIMITER) : path}.*` : deps
            const watcher = store.watch(watchPath,({path:keypath,value:newValue})=>{
                if(isAsync){
                    setValue({
                        ...value,
                        [keypath[keypath.length-1]]:newValue
                    })  
                }else{
                    setValue(getValueBySelector(store,path))  
                } 
            })
            return ()=>watcher.off()
        },[deps])



        return <>{render(renderArgs)}</>
    }, ()=>true) 
}