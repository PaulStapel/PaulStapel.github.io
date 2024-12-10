---
title: "Classical Mechanics Three Ways"
date: "2024-4-10T16:41:15+01:00"
draft: false
description: "Today we derive and explore three ways of doing classical mechanics"
math: true
categories: 
    - mathematics
    - classical mechanics
    - physics
---

Classical mechanics is a very useful tool in describing the world around us. As I am currently taking a course about classical mechanics, I wanted to give a quick overview of the three main ways in which a classical problem can be solved in physics. We will also work through a simple example using the simple pendulum with mass $m$ and length $l$. This article will take you through the main steps you'll have to take to tackle a problem and the derivation of the different methods. Without further ado, let's get to it.

## Newtonian mechanics
Perhaps the most well known approach to solving a mechanics problem is the Newtonian one. You start by constructing the forces working on our system, and from there you use Newton's second lay $\textbf{F} = m \ddot{\textbf{r}}$ to compute the equation of motion for your problem Here, $\ddot{r}$ represents the second time derivative of the position-vector. There is no derivation of this fact, and it is a postulate on which all of Newtonian mechanics is based. (A cool excercise you can try at home is to prove that Newton's first and second law can actually be derived from the first, but I will not go into that here). 

### A pendulum in Newtonian mechanics
It is easiest to describe our pendulum in terms of polar coordinates. Assuming the base of the chord of the pendulum to be at the origin, we can describe the swinging of our pendulum in the xz plane, where our chord extends into the negative z-direction. Then we may take $x = l \sin(\theta)$ and $z = - l \cos(\theta)$. Observe that our system is constrained by the fact that the distane from the origin is a fixed length $l$. This way, we only need one variable (called a generalized coordinate) to describe our system. How nifty!

For the equation of motion, we observe that the unit-vector $\hat{\textbf{r}} = \cos(\theta)\hat{x} + sin(\theta)\hat{z}$, and that $\hat{\theta} = -\sin{\theta}\hat{x} + \cos(\theta)\hat{z}$. Draw these vectors if you are not convinced, as this is in not trivial. Then, $$\frac{\partial \hat{r}}{\partial \theta} = \hat{\theta}, \hspace{1cm} \frac{\partial \hat{\theta}}{\partial \theta} = -\hat{r}$$

From this, we can use the chain rule to find the second derivatives in time for the $\theta$ direction. 

$$\ddot{a}_\theta = r\ddot{\theta} + 2\dot{r}\dot{\theta}$$

Letting $r = l \equiv$ constant, we can observe that only the second term is non-zero. As our system can only move along the circle of it's trajectory, we can conclude that the forces acting in any other direction must cancel out, leaving us to only need to look at this angular direction. As gravity pointing in this direction is given by $F_z = -mg \sin(\theta)$, we observe that $$ml \ddot{\theta} = -mg \sin{\theta} \implies \ddot{\theta} = - \frac{g}{l} \sin{\theta}$$

Which is a well known result. We may analytically solve this for small angles, but I will leave this to the reader if desired. This calculation was mostly done to show how troublesome Newtonian mechanics can sometimes be for even the simplest of problems. Here, we had cross out some forces and calculate derivatives of polar unit vectors all to achieve a simple result. The next two methods will be a bit more elegant. 

## Lagrangian mechanics

Let us first lay the groundwork on which Lagrangian mechanics is based: variational calculus. We will be following Taylor's classical mechanics. 

Given an integral of the following form: 
$$ S = \int_{x_1}^{x_2} f[y(x), y'(x), x]dx$$

We are interested to know for which function $y(x)$, joining two points such that $y(x_1) = y_1, y(x_2) = y_2$, our integral takes a minimum. You can look at $y$ as being some curve connecting two points in space, and our function $f$ as a field that changes some particle going through it in a way. If the value of $f$ is high at some point, then it "takes a lot of effort" to pass this point. 

Then, let us suppose we have found some optimal path $y$. Then we must have that any small perturbation $Y(x) = y(x) + \alpha \eta(x)$ will result in a larger value for S. As this function must have the same endpoints as $y$, we conclude that $\eta$ is zero at those endpoints, and we can view it as the deviation from the optimal path. The scaling factor $\alpha$ can be used to tune how close our solution $Y$ is to the real solution $y$. Then we may take our integral to be dependent on this variable $\alpha$. We can write our integral of path $Y$ to be. 

$$S(\alpha) = \int_{x_1}^{x_2} f[y(x) + \alpha \eta(x), y'(x) + \alpha \eta'(x), x]dx$$

As we want to minimize this, we take the derivative with respect to $\alpha$. This yiels

$$ \frac{dS}{d\alpha} =\int_{x_1}^{x_2} \frac{df}{d\alpha} dx $$

Where using the chain rule, we can find
$$\frac{df}{d\alpha} = \eta \frac{df}{dy} + \eta' \frac{df}{dy'}$$

In that case, we must have 

$$\int_{x_1}^{x_2}  \eta \frac{df}{dy} + \eta' \frac{df}{dy'} dx = 0$$

Using integration by parts, we find that
$$ \int_{x_1}^{x_2} \eta' \frac{df}{dy'} dx = [ \eta \frac{df}{dy'}]_{x_1}^{x_2} - \int_{x_1}^{x_2}  \eta \frac{d}{dx} \frac{df}{dy'} dx $$

Where the second term is zero as we know that there can be no perturbation on the boundaries, such that $\eta$ there is zero. Substituting this back into our eqaution we (famously) find:
$$ \int_{x_1}^{x_2}  \eta (\frac{df}{dy} - \frac{d}{dx} \frac{df}{dy'}) dx = 0 $$

Where the term inside of brackets must be zero to satisfy this equation for all perturbation functions $\eta$. This yields the famous Euler-Lagrange equation: 

$$ \frac{df}{dy} - \frac{d}{dx} \frac{df}{dy'} = 0$$

Thus, if we know the function to minimise inside of our problem, we know that in the optimal path the Euler-Lagrange equation holds, from which we can solve the problem. In physics problems, we say that an object takes the path of least action (the path that costs the least effort in a way). This can then be used to solve various problems. 

The variable $x$ can be chosen to be the variable across which you want to optimize. In most physical cases, you want the best path throught time. Your variable $y$ can be any coordinate. It may be cartesian ($x,y,z$), but it can also be more general, like an angle or radius for example. We call this the generalized coordinate, and denote it $q$. 

### A pendulum in Lagrangian mechanics

The function that we wish to minimise in particular is the Lagrangian, given by $T - U$ with $T$ kinetic energy and $U$ potential energy. We use $-U$ as the negative gradient of U yields the potential force acting on our system, such that this symbol more accurately describes the path of "least resistance" if you will. 

First we set up our Lagrangian $\mathcal{L}$. We know that for point particles like in our pendulum, we can take for the moment of inertia $ml^2$, such that $T = \frac{1}{2}ml^2 \dot{\theta}^2$ Furthermore, our potential energy is given by $U = -mgl \cos{\theta}$, such that
$$ \mathcal{L} =  \frac{1}{2}ml^2 \dot{\theta}^2 + mgl \cos{\theta}$$

We would like to minimise this function through time, using the variable $\theta$, we find for the Euler-Lagrange equation:

$$\frac{df}{d\theta} - \frac{d}{dt} \frac{df}{d\dot{\theta}} =  -mgl \sin{\theta} - ml^2 \ddot{\theta} = 0 $$

Rearranging this equation yields the previously obtained
$$ \ddot{\theta} = - \frac{g}{l} \sin{\theta} $$
Nicely done. 

### How to solve problems in Lagrangian mechanics
In short, what steps will you need to take? 

- Start by chosing your generalized coordinates. 
- Calculate the kinetic and potential energy. 
- Solve the Euler-Lagrange equation for each generalized coordinate
- Profit? 

## Hamiltonian mechanics
In lagrangian mechanics, we used the generalised coordinate $\theta$ and its generalized velocity $\dot{\theta}$ in order to solve our problem. In Hamiltonian mechanics, we prefer to use the generalized momentum. We define this momentum by 

$$p_q = \frac{d \mathcal{L}}{d \dot{q}}$$
Where q represents your generalized coordinate. The hamiltonian is then defined as 
$$ \mathcal{H} = \sum_i p_i \dot{q_i} - \mathcal{L}$$

In case the generalized coordinates are independent of time and the potential energy is independent of generalized velocities, the above defined Hamiltonian is equal to the total energy of the system and is it is conserved. 

We can calculate the derivative (using the chain rule) of the hamiltonian with respect to our generalized coordinates in order to find equations of motion (one dimensional case because it is less writing): 
$$ \frac{d \mathcal{H}}{d q} =  p \frac{d \mathcal{q}}{d q} -  \frac{d \mathcal{L}}{d q} -  \frac{d \mathcal{L}}{d \dot{q}} \frac{d \dot{q}}{d q} = -  \frac{d \mathcal{L}}{d q} = - \frac{d}{dt} \frac{d \mathcal{L}}{d \dot{p}} = -\dot{p}$$
Here, we have used the definition of the generalized momentum and the Euler-Lagrange equation. Next, for the other derivative, we find
$$ \frac{d \mathcal{H}}{d p} = \dot{q} + p \frac{d \mathcal{q}}{d p} - \frac{d \mathcal{L}}{d \dot{q}}\frac{d \dot{q}}{d q} = \dot{q}$$

Thus, these equations can be derived from the Lagrangian mechanics. The Hamiltonian formalism is equivalent to the Lagrangian one. We will work out one last example. 

### A pendulum in Hamiltonian mechanics
We already know an expression for our Lagrangian. 

$$ \mathcal{L} =  \frac{1}{2}ml^2 \dot{\theta}^2 + mgl \cos{\theta}$$

We calculate $p = \frac{d \mathcal{L}}{d \dot{\theta}} = ml^2\dot{\theta}$, such that
$$ \mathcal{H} = ml^2\dot{\theta}^2 - \frac{1}{2}ml^2 \dot{\theta}^2 - mgl \cos{\theta} = \frac{1}{2ml^2}p^2 - mgl \cos{\theta} $$

We recognise this as the total energy of the system, as the generalized coordinates are independent of time and the potential energy is independent of generalized velocity. 

From this, we calculate
$$ \dot{p} = ml^2\ddot{\theta} = - \frac{d \mathcal{H}}{d \theta} = - mgl\sin{\theta} $$ 
We can easily rewrite this back to our solution 
$$ \ddot{\theta} = - \frac{g}{l} \sin{\theta} $$
We even have another equation to use if we want. This second equation will simply give us back the already calculated expression for the generalized momentum. 

### How to solve problems in Hamiltonian mechanics
Next, a short overview of the methods:
- Start by calculating the Lagrangian as per the Lagrangian method
- Calculate the generalized momentum
- From this, compute the Hamiltonian
- Solve Hamilton's equations
- Profit? 

One neat thing about this is that if you already know that the conditions are right, you can simply compute the total energy of the system and take that for the Hamiltonian, saving quite some time. The Hamiltonian at first may seem less useful than the Lagrangian, but when it comes to certain symmetries, the Hamiltonian actually works out a little nicer (as I may write about in another blog). 

## Final remarks
Ok, so that was a quick overview of three ways to solve classical mechanical problems. I hope it was educational. This was also a way for me to go over these three methods again. My main goal was to show how to use these three methods, and also to show the variational calculus used to derive the Euler-Lagrange equations. 

## Signing off, have a lovely day!