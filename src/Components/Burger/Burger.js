import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'
import classes from './Burger.css'
import BurgerBuilder from '../../Containers/BurgerBuilder/BurgerBuilder';

const burger = (props)=>{
    const trasformedIngredients = Object.keys(props.ingredients)
        .map(igKey=>{
            return [...Array(props.ingredients[igKey])].map((_,i)=>{
                return <BurgerIngredient Key = {igKey + i} type = {igKey}/>
            });
        });
    return(
        <div className={classes.Burger}>
            <BurgerIngredient type = "bread-top"/>
            {trasformedIngredients}
            <BurgerIngredient type = "bread-bottom"/>
        </div>
            

    );
}

export default burger;