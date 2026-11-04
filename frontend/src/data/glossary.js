/**
 * Glossary data — the single source of truth for every term definition in
 * the app. The Glossary page lists these, and <GlossaryTerm> popups look
 * their definitions up here, so a definition is written exactly once.
 *
 * `sections` = ids from SECTIONS_NAV where the term is taught or used.
 * `aliases`  = other spellings used in the app ("Weights" → Weight), so
 *              <GlossaryTerm term="Weights"> still finds the entry.
 */

const TERMS = [
  {
    term: "Accuracy",
    definition: "The share of examples the network classifies correctly. 95% accuracy means 95 out of every 100 answers are right.",
    sections: [4, 5],
  },
  {
    term: "Activation Function",
    definition: "A function applied to a neuron's weighted sum that decides what it outputs. It adds the non-linearity that lets networks learn curves instead of only straight lines.",
    sections: [1, 2],
  },
  {
    term: "Architecture",
    definition: "The shape of a network: how many layers it has, how many neurons are in each, and how they connect.",
    sections: [2, 3],
  },
  {
    term: "Backpropagation",
    definition: "The method for working out how much each weight contributed to the loss, by passing the error backwards from the output layer to the input. Gradient descent then uses those numbers to update the weights.",
    sections: [4],
  },
  {
    term: "Bias",
    aliases: ["Biases"],
    definition: "A number added to a neuron's weighted sum. It shifts how easily the neuron activates, independently of its inputs, like a built-in lean toward yes or no.",
    sections: [1, 2],
  },
  {
    term: "Classification",
    definition: "A task where the network sorts each input into one of a fixed set of categories (classes), such as \"inside the circle\" or \"outside\".",
    sections: [4, 5],
  },
  {
    term: "Confidence",
    definition: "How sure the network is about its answer: the probability it gives to the class it picked. Near a decision boundary, confidence drops toward a coin flip.",
    sections: [5],
  },
  {
    term: "Convergence",
    definition: "The point in training where the loss stops improving much, because the network has settled on a good set of weights.",
    sections: [4],
  },
  {
    term: "Dataset",
    definition: "The collection of examples a network learns from. Each example has inputs (here, an x and y position) and the correct answer (its class).",
    sections: [4, 5],
  },
  {
    term: "Decision Boundary",
    definition: "The line or curve where a network's prediction switches from one class to another. It shows what the network has actually learned.",
    sections: [5],
  },
  {
    term: "Deep Learning",
    definition: "Machine learning with neural networks that have many hidden layers. Each layer builds on the one before it, so deep networks can learn very complex patterns.",
    sections: [2],
  },
  {
    term: "Edge",
    aliases: ["Connection", "Connections"],
    definition: "A connection between two neurons in neighbouring layers. Each edge has its own weight that scales the signal travelling along it.",
    sections: [2, 3],
  },
  {
    term: "Epoch",
    aliases: ["Epochs"],
    definition: "One complete pass through every example in the training dataset. Networks usually need many epochs to learn.",
    sections: [4],
  },
  {
    term: "Feature",
    aliases: ["Features"],
    definition: "One input value describing an example, such as the chance of rain, or a point's x position. A network's input layer has one node per feature.",
    sections: [1, 3],
  },
  {
    term: "Forward Pass",
    definition: "Feeding inputs through the network layer by layer to get an output. This is what happens every time a network makes a prediction.",
    sections: [3],
  },
  {
    term: "Gradient Descent",
    definition: "The training method that nudges every weight a small step in the direction that lowers the loss, over and over. The learning rate sets the step size.",
    sections: [4],
  },
  {
    term: "Hidden Layer",
    aliases: ["Hidden Layers"],
    definition: "Any layer between the input and output layers. Hidden layers transform the data step by step, finding patterns that aren't visible in the raw inputs.",
    sections: [2, 3],
  },
  {
    term: "Input Layer",
    definition: "The first layer of a network. Its nodes just hold the input values (features); they don't compute anything.",
    sections: [2, 3],
  },
  {
    term: "Layer",
    aliases: ["Layers"],
    definition: "A group of neurons at the same depth in the network. Data flows from one layer to the next.",
    sections: [2],
  },
  {
    term: "Learning Rate",
    definition: "How big a step gradient descent takes each update. Too small and learning crawls; too large and training overshoots and becomes unstable.",
    sections: [4, 5],
  },
  {
    term: "Loss Function",
    aliases: ["Loss"],
    definition: "A formula that scores how wrong the network's predictions are with a single number. Training tries to make this number as small as possible.",
    sections: [4],
  },
  {
    term: "Neural Network",
    definition: "A model made of layers of simple connected units (neurons). By adjusting the weights between them, it can learn to turn inputs into useful outputs.",
    sections: [2],
  },
  {
    term: "Neuron",
    aliases: ["Node", "Nodes", "Neurons"],
    definition: "The basic unit of a network. It multiplies each input by a weight, adds them up with a bias, and passes the total through an activation function.",
    sections: [1, 2],
  },
  {
    term: "Output Layer",
    definition: "The last layer of a network. Its values are the network's answer, for example one probability per class.",
    sections: [2, 3],
  },
  {
    term: "Overfitting",
    definition: "When a network memorises its training examples, including their noise, instead of learning the general pattern. It looks great on training data but does badly on new data.",
    sections: [5],
  },
  {
    term: "Parameter",
    aliases: ["Parameters"],
    definition: "Any number the network learns during training: all of its weights and biases together.",
    sections: [2],
  },
  {
    term: "Prediction",
    definition: "The network's answer for an input. For classification, it's the class with the highest output value.",
    sections: [3, 5],
  },
  {
    term: "ReLU",
    definition: "Rectified Linear Unit: an activation function that passes positive values through unchanged and turns negatives into 0. Simple, fast and very widely used.",
    sections: [1, 2],
  },
  {
    term: "Sigmoid",
    definition: "An S-shaped activation function that squashes any number into the range 0 to 1, so its output can be read like a probability.",
    sections: [1, 3],
  },
  {
    term: "Softmax",
    definition: "Turns a list of output scores into probabilities that add up to 1. Used on the output layer when there are several classes.",
    sections: [3],
  },
  {
    term: "Tanh",
    definition: "An S-shaped activation function like sigmoid, but squashing values into −1 to 1, centred on zero.",
    sections: [1, 4],
  },
  {
    term: "Training",
    definition: "The process of adjusting a network's weights using examples: predict, measure the loss, nudge the weights to reduce it, and repeat.",
    sections: [4],
  },
  {
    term: "Underfitting",
    definition: "When a network is too simple, or hasn't trained enough, to capture the pattern in the data. It does poorly even on the examples it trained on.",
    sections: [4, 5],
  },
  {
    term: "Weight",
    aliases: ["Weights"],
    definition: "A number on each connection that scales the signal passing through it. Big weights mean strong influence; negative weights push the other way. Training is mostly the search for good weights.",
    sections: [1, 2, 4],
  },
];

/** "Loss Function" → "loss-function" (used for #anchors). */
export function slugify(term) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GLOSSARY = TERMS.map((t) => ({ ...t, aliases: t.aliases ?? [], slug: slugify(t.term) })).sort(
  (a, b) => a.term.localeCompare(b.term)
);

const BY_NAME = new Map(
  GLOSSARY.flatMap((entry) => [entry.term, ...entry.aliases].map((name) => [name.toLowerCase(), entry]))
);

/** Finds an entry by its term or any alias, case-insensitively. */
export function findTerm(name) {
  return BY_NAME.get(name.toLowerCase()) ?? null;
}
