import React,{Component} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSammary';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component{
    state = {
        ingredients:null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading:false,
        error: false,
    }
    async componentDidMount(){
        try{
            const response = await axios.get('https://burger-shop-a988.firebaseio.com/ingredients.json');
            this.setState({ingredients: response.data})
        }catch(err){
            this.setState({error:true})
        }

        
        
    }
    updatePurchaseState = (ingredients)=>{
        
        const sum = Object.keys(ingredients).map(igkey=>{
            return ingredients[igkey]
        }).reduce((sum,el)=>{
            return sum + el;
        },0)
        this.setState({purchasable:sum>0})
    }
    addIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount +1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice +priceDeduction;
        this.setState({
            totalPrice: newPrice, ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        if(oldCount <=0){
            return;
        }
        const updatedCount = oldCount -1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice -priceAddition;
        this.setState({
            totalPrice: newPrice, ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
    }
    purchaseHandlar = ()=>{
        this.setState({purchasing:true})
    }
    purchaseCancelHandlar = ()=>{
        this.setState({purchasing:false})
    }
    purchaseContinueHandler = async()=>{
        // alert('You Continued')
        this.setState( { loading: true } );
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice.toFixed(2),
            customer:{
                name: 'Ayham Koutiney',
                address:{
                    street: 'TestStreet 1',
                    zipCode: '3343TS',
                    city: 'TestCity',
                    province: 'TestProvince' 
                },
                email: 'test@test.com'
            },
            delveryMethod: 'fastest'
        }
        // try{
        //     await axios.post('/orders.json',order);
        //     this.setState({ loading: false, purchasing: false })
        // }catch(err){
        //     this.setState({loading: false,purchasing: false})
        //     console.log(err)
        // }
       

    }
    
    render(){
        const disabledInfo ={
            ...this.state.ingredients
        } 
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0
        }

        let orderSummary = null;
            
        let burger = this.state.error?<p>Ingredients can't be loaded!</p>:<Spinner style = {{marginTop: 'auto'}}/>;
        
            if(this.state.ingredients){
                burger = (
                    <Aux>
                        <Burger ingredients = {this.state.ingredients}/>
                        <BuildControls
                        ingredientAdded = {this.addIngredientHandler}
                        ingredientRemoved = {this.removeIngredientHandler}
                        disabled = {disabledInfo}
                        purchasable = {this.state.purchasable}
                        ordered = {this.purchaseHandlar}
                        price = {this.state.totalPrice}/>
                    </Aux>
                );
                orderSummary = (<OrderSummary 
                    ingredients = {this.state.ingredients}
                    purchaseCancelled = {this.purchaseCancelHandlar} 
                    purchaseContinued = {this.purchaseContinueHandler}
                    price = {this.state.totalPrice}
                    />);
            }
            if(this.state.loading){
                orderSummary = <Spinner/>
            }
             
        return(
            <Aux>
                <Modal show = {this.state.purchasing} modalClosed = {this.purchaseCancelHandlar}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default WithErrorHandler(BurgerBuilder,axios);