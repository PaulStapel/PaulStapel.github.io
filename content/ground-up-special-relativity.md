---
title: "Special Relativity From The Ground Up"
date: "2025-02-19T16:22:39+01:00"
draft: false
description: "Building special relativity from 'simple' symmetry arguments"
categories: 
    - general
    - field theory
    - physics
math: true
---

I am currently taking a course on field theory, and we are currently working with Lorentz transformations and the likes. I have never really liked the way lorentz transformations are introduced, as previously, they weren't derived that much, and we just had to take them for granted. The book we are currently working with is also a bit lackluster when it comes to the full derivation of lorentz transformations and the likes, and so I wanted to give this derivation a shot to see if I could explain it in a more intuitive way. Let's get into it. 

## Postulates 
To start things off, we want to have a few postulates on which we base all further derivation. 
1. We shall be working in the coordinates  $\mathbf{x} = (t,x,y,z)$, representing time and three space coordinates. We assume it possible to transform between coordinate systems. 
2. We imagine our coordinate system to be "inertial", meaning a body at rest will stay at rest in the frames we observe. 
3. We let the speed of light $c$ be a constant value, independent of our frame of reference. 
4. Lastly, we require that all transformations between frames are linear, meaning that a coordinate transformation are of the form $\mathbf{y} = \Lambda \mathbf{x}$, where $\Lambda$ represents the Lorentz transformation matrix (as of yet structureless). 
5. All transformations should be physical, so no time reversal or space mirroring. 

The position vector, which is a 4-vector, will from hereon be noted as $x^{\mu}$, with $\mu \in \{0,1,2,3\}$. Then, $\mu = 0$ represents time, while the other three values represent space.  

## Deriving the spacetime interval and Minkowski metric
From postulate 3, we can easily see that for a ray of light that travels between two points, this constant speed multiplied by the time traveled will equal the distance traveled. Then, we obtain the invariant spacetime interval $$ \Delta (x^0)^2 = \Delta (x^1)^2 + \Delta (x^2)^2 + \Delta (x^3)^2 $$
By looking at coordinates with respect to the origin, we can talk about the coordinates instead of the difference in coordinates, so that we have an invariant $(x^0)^2 - (x^1)^2 + (x^2)^2 + (x^3)^2 = 0$. In tensor notation, we can write this as $$x^\mu g_{\mu \nu} x^\nu = 0$$

Here, $g_{\mu \nu}$ is a metric tensor called the Minkowski metric. From postulate 4, we can see that this metric is conserved under Lorentz transformation, as it must hold that 
$$x^\mu g_{\mu \nu} x^\nu = y^\mu g_{\mu \nu} y^\nu =  x^\rho  (\Lambda^{\mu}_\rho g_{\mu \nu}\Lambda^{\nu}_\sigma)  x^\sigma $$ 
Which yields $ \Lambda^{\mu}_\rho \Lambda^{\nu}_\sigma  g_{\mu \nu}= g_{\mu \nu} $. At first, I thought that isometricity of the Lorentz transformation should have been another postulate to add to special relativity, but as we can see, it is a consequence of Postulates 3 and 4. 

## Lorentz transformations
There are, in general, two transformations we should consider. Rotations and boosts. Postulate 5 ensures that time reversal and space mirroring are exluded from our possible Lorentz transformations. 

The case of rotations is not really that interesting, as time will behave as normal, and all Lorentz transformations of this form can simply be generalised to the rotation matrix acting on $x^\mu$, $\mu \neq 0$. 

Far more interesting, however, is what boosts act like. A boost is an added velocity, call it $v$, from one system to another. For simplicity, let us assume this boost to be in the $x$-direction. Then, we can assume that the coordinates $y,z$ will remain exactly the same by symmetry. Our Lorentz-transformation takes the form 
$$ \begin{pmatrix}
           y^0 \\
           y^1 \\
         \end{pmatrix} =
         \Lambda 
         \begin{pmatrix}
           x^0 \\
           x^1 \\
         \end{pmatrix}
$$ 
Here, we ignore all constant parts and only focus on coordinates that (might) change. But we know that the Lorentz-transformation is isometric, so it must hold that 
$$ \Lambda^T g \Lambda = g = \begin{pmatrix}
           -1 & 0 
        \\
           0 & 1\\
         \end{pmatrix}$$
Taking the most general form of $\Lambda$, we can write that $$\Lambda = \begin{pmatrix}
           a & b 
        \\
           c & d\\
         \end{pmatrix}$$
From which we can, with a little algebra, obtain the following equality: 
$$ 
\begin{pmatrix}
        bc - a^2 & db - ab \\
        dc - ac & d^2 - bc \\
\end{pmatrix} =
\begin{pmatrix}
           -1 & 0 
        \\
           0 & 1\\
\end{pmatrix}$$
Then, it must hold that $a = d$ and $a^2 - bc = 1$. From symmetry arguments, we would expect a symmetric matrix for $\Lambda$, so we can see that a general solution takes the form $a = d = \cosh( \theta )$ and $c = b = sinh(\theta)$. Where both angles are as of yet undefined. 
We obtain the Lorentz transformation 
$$ \begin{pmatrix}
           y^0 \\
           y^1 \\
         \end{pmatrix} =
         \begin{pmatrix}
           cosh(\theta) & sinh(\theta) \\ 
           sinh(\theta) & cosh(\theta) \\
         \end{pmatrix}
         \begin{pmatrix}
           x^0 \\
           x^1 \\
         \end{pmatrix}
$$ 
Here, the angle can be any real value. It is interesting to note that this angle has a physical interpretation. It is called the rapidity, and it resembles velocity inside of a relativistic frame. While velocities do not add as normal (as can be observed by the form of this transformation), the rapidity do, and thus they resemble a more general relativistic velocity. This addition of rapidities can be easily observed by writing these hyperbolics in their exponential forms. 

## From rapidity to velocity
Finally, in order to go from this rapidity to a more standard velocity based Lorentz-transformation, we can observe that
$$ \frac{1}{c} \frac{dy^1}{dy^0} = tanh(\theta)$$
From which we can conclude that $\tanh\theta) = -\frac{v}{c}$. Here, the minus sign is introduced as the boost of $v$ with regards to the first frame means a boost of $-v$ with regards to the second frame, so in that frame the velocity would become $-v$. Using hyperbolic identities, it follows that $\cosh(\theta) = \gamma$ and $\sinh(\theta) = -\frac{v}{c} \gamma$, where $$ \gamma = \frac{1}{\sqrt{1- \frac{v^2}{c^2}}}$$
is the well-known gamma-factor. Then, the Lorentz-transformation takes the final form

$$ \begin{pmatrix}
           y^0 \\
           y^1 \\
         \end{pmatrix} =
         \gamma \begin{pmatrix}
           1 &  -\frac{v}{c}\\ 
           -\frac{v}{c} & 1 \\
         \end{pmatrix}
         \begin{pmatrix}
           x^0 \\
           x^1 \\
         \end{pmatrix}
$$ 
Which is the Lorentz-transformation as you know it. 

## Final remarks
Although I have tried to be a little more formal about deriving special relativity, there are even better ways of doing this. For further reading, I recommend reading [this paper](https://vixra.org/pdf/1510.0123v1.pdf).

## Signing off, have a lovely day!





