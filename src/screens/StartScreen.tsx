import {Button} from "@/components/ui/button"

type Props = {onStart: () => void}

export default function StartScreen({onStart}: Props){
    return(
        <main className="p-8">
            <h1 className="text-3xl font-bold">Can You Afford This House?</h1>
            <p>Lenders don't ask if you love the house. They ask if the numbers fit.</p>
            <Button onClick={onStart}>Start</Button>
        </main>
    )
}