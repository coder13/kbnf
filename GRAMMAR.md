<grammar>     ::= <rule> | <rule> <grammar> | <comment> <grammar>

<comment>     ::= "#" <text> <eol>
<rule>        ::= <ruledef> <owsp> "=" <owsp> <expression> <eol>
<ruledef>     ::= "<" <rule-name> ">"
<rule-name>   ::= <letter> <rule-char> | <letter>
<rule-text>   ::= <rule-char> <rule-text>
<rule-char>   ::= <letter> | <integer> | "-"
<owsp>        ::= " " <owsp> | ""
<values>      ::= <terms> | <terms> <owsp> "|" <owsp> <values>
<terms>       ::= <term> | <term> " " <owsp> <terms>
<term>        ::= <literal> | <ruldef>
<literal>     ::= "'" <text> "'" | '"' <text> '"' | <integer>
<text>        ::= <char> | <char> <text>
<char>        ::= <letter> | <digit> | <symbol>
<integer>      ::= <digit> | <digit> <integer>
<digit>       ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<string>      ::= <letter> | <letter> <string>
<letter>      ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
<symbol>      ::=  "|" | " " | "!" | "#" | "$" | "%" | "&" | "(" | ")" | "*" | "+" | "," | "-" | "." | "/" | ":" | ";" | ">" | "=" | "<" | "?" | "@" | "[" | "\" | "]" | "^" | "_" | "`" | "{" | "}" | "~"
<eol>         ::= "\n" | "\r" | "\r\n"


((((4) 3) 2) 1)